use anyhow::{Context, Result};
use chrono::{TimeZone, Utc};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::time::SystemTime;
use tracing::debug;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum JwtData {
    User { user_id: String },
    Session { session_id: String },
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct ParsedJwt {
    pub expires: Option<chrono::DateTime<Utc>>,
    pub data: JwtData,
}

pub const DEFAULT_USER_EXPIRE_S: u64 = 60 * 60 * 8;
pub const DEFAULT_SESSION_EXPIRE_S: u64 = 60 * 60 * 24 * 14;

#[derive(Debug)]
pub struct Key {
    encoding: EncodingKey,
    decoding: DecodingKey,
    user_expire_s: u64,
    session_expire_s: u64,
}

pub enum ExpirePolicy {
    UserDefault,
    SessionDefault,
    TimeSec(u64),
}

// TEMPORARY: Remove after 2026-06-01 — handles legacy JWTs where exp was serialized as a string
fn deserialize_exp_opt<'de, D>(deserializer: D) -> Result<Option<u64>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    struct ExpVisitor;
    impl<'de> serde::de::Visitor<'de> for ExpVisitor {
        type Value = Option<u64>;
        fn expecting(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
            write!(f, "a u64 or string-encoded u64, or null")
        }
        fn visit_none<E: serde::de::Error>(self) -> Result<Self::Value, E> {
            Ok(None)
        }
        fn visit_some<D2: serde::Deserializer<'de>>(self, d: D2) -> Result<Self::Value, D2::Error> {
            d.deserialize_any(InnerExpVisitor).map(Some)
        }
    }

    struct InnerExpVisitor;
    impl<'de> serde::de::Visitor<'de> for InnerExpVisitor {
        type Value = u64;
        fn expecting(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
            write!(f, "a u64 or string-encoded u64")
        }
        fn visit_u64<E: serde::de::Error>(self, v: u64) -> Result<u64, E> {
            Ok(v)
        }
        fn visit_i64<E: serde::de::Error>(self, v: i64) -> Result<u64, E> {
            u64::try_from(v).map_err(|_| E::custom("negative exp value"))
        }
        fn visit_str<E: serde::de::Error>(self, v: &str) -> Result<u64, E> {
            v.parse::<u64>()
                .map_err(|_| E::custom("exp string is not a valid u64"))
        }
        fn visit_string<E: serde::de::Error>(self, v: String) -> Result<u64, E> {
            self.visit_str(&v)
        }
    }

    deserializer.deserialize_option(ExpVisitor)
}

#[derive(Serialize, Deserialize)]
struct Claims {
    #[serde(skip_serializing_if = "Option::is_none")]
    user_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    session_id: Option<String>,
    // TEMPORARY: Remove after 2026-06-01 — deserialize_with handles string exp values
    #[serde(
        default,
        skip_serializing_if = "Option::is_none",
        deserialize_with = "deserialize_exp_opt"
    )]
    exp: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    iat: Option<u64>,
}

impl Key {
    pub fn new(
        secret: &str,
        user_expire_s: Option<u64>,
        session_expire_s: Option<u64>,
    ) -> Result<Self> {
        Ok(Key {
            encoding: EncodingKey::from_secret(secret.as_bytes()),
            decoding: DecodingKey::from_secret(secret.as_bytes()),
            user_expire_s: user_expire_s.unwrap_or(DEFAULT_USER_EXPIRE_S),
            session_expire_s: session_expire_s.unwrap_or(DEFAULT_SESSION_EXPIRE_S),
        })
    }

    fn now_sec() -> u64 {
        SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs()
    }

    fn expiry(&self, policy: ExpirePolicy) -> u64 {
        let now = Self::now_sec();
        match policy {
            ExpirePolicy::UserDefault => now + self.user_expire_s,
            ExpirePolicy::SessionDefault => now + self.session_expire_s,
            ExpirePolicy::TimeSec(sec) => now + sec,
        }
    }

    fn sign(&self, claims: Claims) -> Result<String> {
        encode(&Header::new(Algorithm::HS256), &claims, &self.encoding)
            .context("Failed to encode JWT")
    }

    pub fn make_user_jwt(&self, user_id: &str, expire: ExpirePolicy) -> Result<String> {
        self.sign(Claims {
            user_id: Some(user_id.to_string()),
            session_id: None,
            exp: Some(self.expiry(expire)),
            iat: None,
        })
    }

    pub fn make_session_jwt(&self, session_id: &str, expire: ExpirePolicy) -> Result<String> {
        self.sign(Claims {
            user_id: None,
            session_id: Some(session_id.to_string()),
            exp: Some(self.expiry(expire)),
            iat: None,
        })
    }

    pub fn verify_jwt(&self, token: &str) -> Result<ParsedJwt> {
        let mut validation = Validation::new(Algorithm::HS256);
        validation.validate_exp = false;
        validation.required_spec_claims = HashSet::new();

        let claims = decode::<Claims>(token, &self.decoding, &validation)
            .context("Failed to decode JWT")?
            .claims;

        let expires = if let Some(exp) = claims.exp {
            let exp = Utc
                .timestamp_opt(exp as i64, 0)
                .earliest()
                .context("Invalid exp timestamp")?;
            let now = Utc::now();
            if exp < now {
                debug!("Token exp: {} time now: {} - token has expired", exp, now);
                anyhow::bail!("Token has expired");
            } else {
                debug!(
                    "Token exp: {} time now: {} - token good for {}",
                    exp,
                    now,
                    exp - now
                );
            }
            Some(exp)
        } else if claims.iat.is_some() {
            None
        } else {
            anyhow::bail!("Missing exp and iat claim");
        };

        let data = if let Some(user_id) = claims.user_id {
            JwtData::User { user_id }
        } else if let Some(session_id) = claims.session_id {
            JwtData::Session { session_id }
        } else {
            anyhow::bail!("Missing user_id or session_id claim");
        };

        Ok(ParsedJwt { expires, data })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_make_and_verify_jwt_success() -> Result<()> {
        let key = Key::new("test_secret", None, None)?;
        let token = key.make_user_jwt("test_user", ExpirePolicy::UserDefault)?;
        let parsed = key.verify_jwt(&token)?;
        assert_eq!(
            parsed.data,
            JwtData::User {
                user_id: "test_user".into()
            }
        );
        assert!(parsed.expires.unwrap() > Utc::now());
        Ok(())
    }

    #[test]
    fn test_verify_jwt_invalid_token() {
        let key = Key::new("test_secret", None, None).unwrap();
        assert!(key.verify_jwt("invalid.token.string").is_err());
    }
}
