use anyhow::{Context, Result};
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode, decode_header};
use serde::{Deserialize, Serialize};
use std::sync::LazyLock;
use thiserror::Error;
use tracing::debug;

const AUTH0_DOMAIN: &str = "auth.seslogin.com";
const AUTH0_AUDIENCE: &str = "https://api.seslogin.com";
const JWKS_URL: &str = "https://auth.seslogin.com/.well-known/jwks.json";

#[derive(Debug, Serialize, Deserialize)]
pub struct Auth0Claims {
    pub sub: String,
    pub aud: Vec<String>,
    pub iss: String,
    pub exp: i64,
    pub iat: i64,
    #[serde(default, rename = "https://seslogin.com/email")]
    pub email: Option<String>,
    #[serde(default)]
    pub scope: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Auth0User {
    /// Auth0 user ID (sub claim)
    pub id: String,
    /// User's email address
    pub email: Option<String>,
    /// Token expiration time (Unix timestamp)
    pub expires_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct JwksResponse {
    keys: Vec<JwksKey>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct JwksKey {
    kid: String,
    #[serde(rename = "use")]
    use_: String,
    n: String,
    e: String,
    alg: String,
}

#[derive(Debug, Error)]
pub enum VerifyError {
    #[error("{0}")]
    Transient(String),
    #[error("{0}")]
    Permanent(String),
}

static JWKS_CACHE: LazyLock<tokio::sync::Mutex<Option<JwksResponse>>> =
    LazyLock::new(|| tokio::sync::Mutex::new(None));

async fn fetch_jwks() -> Result<JwksResponse> {
    // Check cache first
    let cache = JWKS_CACHE.lock().await;
    if let Some(jwks) = cache.as_ref() {
        debug!("Using cached JWKS");
        return Ok(JwksResponse {
            keys: jwks.keys.clone(),
        });
    }
    drop(cache);

    debug!("Fetching JWKS from Auth0");
    let response = reqwest::get(JWKS_URL)
        .await
        .context("Failed to fetch JWKS from Auth0")?;

    let jwks: JwksResponse = response
        .json()
        .await
        .context("Failed to parse JWKS response")?;

    // Cache the JWKS
    let mut cache = JWKS_CACHE.lock().await;
    *cache = Some(JwksResponse {
        keys: jwks.keys.clone(),
    });
    debug!("JWKS cached");

    Ok(jwks)
}

pub async fn verify_auth0_token(token: &str) -> Result<Auth0User, VerifyError> {
    let header = decode_header(token)
        .context("Failed to decode JWT header")
        .map_err(|e| VerifyError::Permanent(e.to_string()))?;
    let kid = header
        .kid
        .ok_or_else(|| VerifyError::Permanent("Missing 'kid' in JWT header".into()))?;

    debug!("Verifying Auth0 token with kid: {}", kid);

    let jwks = fetch_jwks()
        .await
        .map_err(|e| VerifyError::Transient(format!("Failed to fetch JWKS: {}", e)))?;

    let jwks_key = jwks.keys.iter().find(|k| k.kid == kid).ok_or_else(|| {
        VerifyError::Permanent(format!("Key with kid '{}' not found in JWKS", kid))
    })?;

    let decoding_key = DecodingKey::from_rsa_components(&jwks_key.n, &jwks_key.e)
        .context("Failed to create decoding key from JWK")
        .map_err(|e| VerifyError::Permanent(e.to_string()))?;

    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_audience(&[AUTH0_AUDIENCE]);
    validation.set_issuer(&[&format!("https://{}/", AUTH0_DOMAIN)]);

    let token_data = decode::<Auth0Claims>(token, &decoding_key, &validation)
        .context("Failed to verify Auth0 token")
        .map_err(|e| VerifyError::Permanent(e.to_string()))?;

    let claims = token_data.claims;
    debug!("Auth0 token verified successfully for user: {}", claims.sub);

    Ok(Auth0User {
        id: claims.sub,
        email: claims.email,
        expires_at: claims.exp,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_auth0_constants() {
        assert!(AUTH0_AUDIENCE.starts_with("https://"));
        assert!(!AUTH0_DOMAIN.contains("://"));
        assert_eq!(
            JWKS_URL,
            format!("https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        );
    }
}
