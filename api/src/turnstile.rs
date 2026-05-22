use anyhow::{Context, Result, bail};
use serde::Deserialize;

const SITEVERIFY_URL: &str = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

#[derive(Deserialize)]
struct SiteverifyResponse {
    success: bool,
}

/// Verify a Cloudflare Turnstile token server-side.
///
/// Returns `Ok(true)` on success, `Ok(false)` on challenge failure.
/// Returns `Err` for configuration issues or network failures.
///
/// Skips verification and returns `Ok(true)` when `TURNSTILE_DISABLED=1` is set,
/// which is intended for local development only.
pub async fn verify(token: &str) -> Result<bool> {
    if std::env::var("TURNSTILE_DISABLED").as_deref() == Ok("1") {
        tracing::warn!("Turnstile verification disabled (TURNSTILE_DISABLED=1)");
        return Ok(true);
    }

    let secret = std::env::var("TURNSTILE_SECRET_KEY")
        .context("TURNSTILE_SECRET_KEY not set and TURNSTILE_DISABLED is not 1")?;

    let client = reqwest::Client::new();
    let resp = client
        .post(SITEVERIFY_URL)
        .form(&[("secret", secret.as_str()), ("response", token)])
        .send()
        .await
        .context("Failed to reach Turnstile siteverify endpoint")?;

    if !resp.status().is_success() {
        bail!(
            "Turnstile siteverify returned HTTP {}",
            resp.status().as_u16()
        );
    }

    let body: SiteverifyResponse = resp
        .json()
        .await
        .context("Failed to parse Turnstile siteverify response")?;

    Ok(body.success)
}
