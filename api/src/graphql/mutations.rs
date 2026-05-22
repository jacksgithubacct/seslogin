#![allow(clippy::too_many_arguments)]
use anyhow::Result;
use anyhow::anyhow;
use async_graphql::Context;
use async_graphql::Enum;
use async_graphql::ID;
use async_graphql::Object;
use async_graphql::SimpleObject;
use std::sync::Arc;
use tracing::info;
use tracing::warn;

use crate::app::App;
use crate::app::HasDb;
use crate::app::HasSqs;
use crate::auth;
use crate::auth::AuthInfo;
use crate::db;
use crate::db::Handler;
use hex;

use super::auth::{AuthGuard, AuthRequirement, require_location_access, require_writable};
use super::{ApiToken, Category, Location, NitcGroup, Period, Person, Session, User};

async fn enqueue_nitc_export(sqs: &crate::sqs_dispatch::SqsQueue, period_id: &str) {
    if let Err(e) =
        crate::sqs_dispatch::enqueue_period_nitc_export(&sqs.client, &sqs.queue_url, period_id)
            .await
    {
        warn!(
            "Failed to enqueue NITC export for period {}: {}",
            period_id, e
        );
    }
}

fn parse_session_config_json(
    config: Option<&str>,
) -> Result<serde_json::Map<String, serde_json::Value>> {
    let Some(config) = config else {
        return Ok(serde_json::Map::new());
    };
    if config.trim().is_empty() {
        return Ok(serde_json::Map::new());
    }

    match serde_json::from_str::<serde_json::Value>(config)? {
        serde_json::Value::Object(obj) => Ok(obj),
        _ => Err(anyhow!("Session config must be a JSON object")),
    }
}

fn normalize_healthcheck_url(healthcheck_url: Option<&str>) -> Result<Option<String>> {
    let Some(healthcheck_url) = healthcheck_url.map(str::trim) else {
        return Ok(None);
    };

    if healthcheck_url.is_empty() {
        return Ok(None);
    }

    if healthcheck_url.len() > 255 {
        return Err(anyhow!("Health check URL must be 255 characters or fewer"));
    }

    let parsed = reqwest::Url::parse(healthcheck_url)
        .map_err(|_| anyhow!("Health check URL must be a valid absolute URL"))?;

    match parsed.scheme() {
        "http" | "https" => Ok(Some(healthcheck_url.to_string())),
        _ => Err(anyhow!("Health check URL must use http or https")),
    }
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
enum RegisterState {
    NotFound,
    SignedIn,
    SignOutPending,
}

#[derive(SimpleObject)]
struct RegisterResult<A: App + HasDb + Send + Sync + 'static> {
    state: RegisterState,
    period: Option<Period<A>>,
}

#[derive(SimpleObject)]
struct CreateApiTokenResult {
    /// The newly-created api token record (no secret).
    token: ApiToken,
    /// The plaintext secret. Returned only once at creation — never again.
    secret: String,
}

pub struct MutationRoot<A: App + HasDb + HasSqs + Send + Sync> {
    pub(super) app: Arc<A>,
}

#[Object]
impl<A: App + HasDb + HasSqs + Send + Sync + 'static> MutationRoot<A> {
    async fn auth_session(&self, code: String) -> Option<String> {
        let res = auth::issue_token_for_scan_code(&*self.app, &code).await;

        match res {
            Ok(token) => Some(token),
            Err(e) => {
                info!("Auth failed for code {}: {}", code, e);

                // hide details of auth error from user
                None
            }
        }
    }

    /// Request an email login code. Always returns true to avoid email enumeration.
    /// Requires a valid Cloudflare Turnstile token.
    async fn request_auth_code(&self, email: String, turnstile_token: String) -> bool {
        use sha2::{Digest, Sha256};

        match crate::turnstile::verify(&turnstile_token).await {
            Ok(true) => {}
            Ok(false) => {
                info!("Turnstile challenge failed for request_auth_code");
                return true;
            }
            Err(e) => {
                warn!("Turnstile error in request_auth_code: {:#}", e);
                return true;
            }
        }

        let user_id = match self.app.db().get_user_id_by_email(&email).await {
            Ok(Some(id)) => id,
            Ok(None) => return true,
            Err(e) => {
                warn!("DB error looking up user in request_auth_code: {:#}", e);
                return true;
            }
        };

        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        // Rate limit: at most one code per 30 seconds per email
        if let Ok(Some(existing)) = self.app.db().get_login_code(&email).await
            && now < existing.last_sent_at + 30
        {
            info!("Rate limit hit for request_auth_code email={}", email);
            return true;
        }

        let code = crate::nonce::generate_code(6);
        let code_hash = {
            let mut hasher = Sha256::new();
            hasher.update(code.as_bytes());
            hex::encode(hasher.finalize())
        };
        let expires_at = now + 10 * 60;

        if let Err(e) = self
            .app
            .db()
            .put_login_code(&email, &code_hash, expires_at, now)
            .await
        {
            warn!("Failed to store login code: {:#}", e);
            return true;
        }

        let subject = "Your seslogin login code";
        let body = format!(
            "Your login code is: {}\n\nThis code expires in 10 minutes. Do not share it.\n\nIf you did not request this code, you can ignore this email.",
            code
        );

        tracing::info!(user_id = %user_id, "Sending login code to {}", email);
        if let Err(e) = crate::mail::send_plain_text(&email, subject, &body).await {
            warn!("Failed to send login code email to {}: {:#}", email, e);
        }

        true
    }

    /// Verify an email login code and return an opaque session token on success.
    async fn verify_auth_code(&self, email: String, code: String) -> Option<String> {
        use sha2::{Digest, Sha256};

        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let record = match self.app.db().get_login_code(&email).await {
            Ok(Some(r)) => r,
            Ok(None) => {
                info!("verify_auth_code: no code for email={}", email);
                return None;
            }
            Err(e) => {
                warn!("DB error in verify_auth_code: {:#}", e);
                return None;
            }
        };

        if now >= record.expires_at {
            let _ = self.app.db().delete_login_code(&email).await;
            info!("verify_auth_code: expired code for email={}", email);
            return None;
        }

        if record.attempts >= 5 {
            let _ = self.app.db().delete_login_code(&email).await;
            info!("verify_auth_code: too many attempts for email={}", email);
            return None;
        }

        let _ = self.app.db().increment_login_code_attempts(&email).await;

        let expected_hash = {
            let mut hasher = Sha256::new();
            hasher.update(code.as_bytes());
            hex::encode(hasher.finalize())
        };

        if record.code_hash != expected_hash {
            info!("verify_auth_code: wrong code for email={}", email);
            return None;
        }

        let _ = self.app.db().delete_login_code(&email).await;

        let user_id = match self.app.db().get_user_id_by_email(&email).await {
            Ok(Some(id)) => id,
            Ok(None) => {
                warn!("verify_auth_code: user not found for email={}", email);
                return None;
            }
            Err(e) => {
                warn!("DB error fetching user in verify_auth_code: {:#}", e);
                return None;
            }
        };

        match auth::issue_user_token(&*self.app, &user_id).await {
            Ok(token) => {
                info!("Issued user token for user_id={}", user_id);
                Some(token)
            }
            Err(e) => {
                warn!("Failed to issue user token: {:#}", e);
                None
            }
        }
    }

    /// Revoke the current user's opaque session token (no-op for Auth0/JWT sessions).
    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn logout(&self, ctx: &Context<'_>) -> Result<bool> {
        if let Some(AuthInfo::User {
            token_id: Some(token_id),
            ..
        }) = ctx.data_opt::<AuthInfo>()
        {
            self.app.db().delete_user_token(token_id).await?;
        }
        Ok(true)
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn create_user(
        &self,
        email: String,
        is_super: bool,
        location_grants: Vec<String>,
    ) -> Result<User<A>> {
        if !location_grants.is_empty() {
            let found = self
                .app
                .db()
                .get_locations(location_grants.as_slice())
                .await?;
            for (id, loc) in location_grants.iter().zip(found.iter()) {
                if loc.is_none() {
                    return Err(anyhow!("Location {:?} not found", id));
                }
            }
        }
        let rec = self
            .app
            .db()
            .create_user(&email, is_super, location_grants)
            .await?;

        // TODO: email user with setup instructions

        Ok(User::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn update_user(
        &self,
        id: ID,
        email: String,
        is_super: bool,
        is_dev: bool,
        deleted: bool,
        location_grants: Vec<String>,
    ) -> Result<User<A>> {
        if !location_grants.is_empty() {
            let found = self
                .app
                .db()
                .get_locations(location_grants.as_slice())
                .await?;
            for (id, loc) in location_grants.iter().zip(found.iter()) {
                if loc.is_none() {
                    return Err(anyhow!("Location {:?} not found", id));
                }
            }
        }
        self.app
            .db()
            .update_user(
                &id,
                db::UserUpdateShape::Fields {
                    email: &email,
                    is_super,
                    is_dev,
                    deleted,
                    location_grants,
                },
            )
            .await
            .map_err(|e| {
                warn!("db error: {:?}", e);
                e
            })?;

        let rec = self.app.db().get_users(&[&id]).await?;

        Ok(User::new(rec.into_iter().next().flatten().ok_or_else(
            || anyhow!("User with ID {:?} missing", &id),
        )?))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn create_person(
        &self,
        ctx: &Context<'_>,
        location_id: ID,
        first_name: String,
        last_name: String,
        #[graphql(name = "memberNumber")] registration_number: String,
    ) -> Result<Person<A>> {
        require_writable(ctx)?;
        require_location_access(ctx, &location_id)?;
        self.app
            .db()
            .get_locations(&[&location_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Location {:?} not found", &location_id))?;

        let rec = self
            .app
            .db()
            .create_person(&location_id, &first_name, &last_name, &registration_number)
            .await?;

        Ok(Person::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn update_person(
        &self,
        ctx: &Context<'_>,
        id: ID,
        first_name: String,
        last_name: String,
        #[graphql(name = "memberNumber")] registration_number: String,
    ) -> Result<Person<A>> {
        require_writable(ctx)?;
        let existing = self
            .app
            .db()
            .get_persons(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Person with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;

        self.app
            .db()
            .update_person(
                &id,
                db::PersonUpdateShape::Fields {
                    first_name: &first_name,
                    last_name: &last_name,
                    registration_number: &registration_number,
                },
            )
            .await?;

        let mut rec = self.app.db().get_persons(&[&id]).await?;
        Ok(Person::new(rec.pop().flatten().ok_or_else(|| {
            anyhow!("Person with ID {:?} missing", &id)
        })?))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn delete_person(&self, ctx: &Context<'_>, id: ID) -> Result<bool> {
        require_writable(ctx)?;
        let existing = self
            .app
            .db()
            .get_persons(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Person with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;

        self.app
            .db()
            .update_person(&id, db::PersonUpdateShape::Delete)
            .await?;
        Ok(true)
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn create_period(
        &self,
        ctx: &Context<'_>,
        person_id: ID,
        location_id: ID,
        category_id: ID,
        start_time: i64,
        end_time: i64,
    ) -> Result<Period<A>> {
        require_writable(ctx)?;
        if start_time >= end_time {
            return Err(anyhow!("start_time must be before end_time"));
        }
        require_location_access(ctx, &location_id)?;
        self.app
            .db()
            .get_locations(&[&location_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Location {:?} not found", &location_id))?;
        self.app
            .db()
            .get_persons(&[&person_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Person {:?} not found", &person_id))?;
        self.app
            .db()
            .get_categories(&[&category_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Category {:?} not found", &category_id))?;

        let rec = self
            .app
            .db()
            .create_period(
                &person_id,
                &location_id,
                &category_id,
                start_time as u64,
                end_time as u64,
            )
            .await?;

        enqueue_nitc_export(&self.app.sqs().nitc_export, &rec.id).await;
        Ok(Period::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn update_period(
        &self,
        ctx: &Context<'_>,
        id: ID,
        person_id: ID,
        location_id: ID,
        category_id: ID,
        start_time: i64,
        end_time: i64,
    ) -> Result<Period<A>> {
        require_writable(ctx)?;
        if start_time >= end_time {
            return Err(anyhow!("start_time must be before end_time"));
        }
        let existing = self
            .app
            .db()
            .get_periods(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Period with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;
        require_location_access(ctx, &location_id)?;
        self.app
            .db()
            .get_locations(&[&location_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Location {:?} not found", &location_id))?;
        self.app
            .db()
            .get_persons(&[&person_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Person {:?} not found", &person_id))?;
        self.app
            .db()
            .get_categories(&[&category_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Category {:?} not found", &category_id))?;

        self.app
            .db()
            .update_period(
                &id,
                db::PeriodUpdateShape::Fields {
                    person_id: &person_id,
                    location_id: &location_id,
                    category_id: &category_id,
                    start_time,
                    end_time,
                },
            )
            .await?;

        let rec = self.app.db().get_periods(&[&id]).await?;
        let period = rec
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Period with ID {:?} missing", &id))?;

        enqueue_nitc_export(&self.app.sqs().nitc_export, &period.id).await;
        Ok(Period::new(period))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn update_period_time_category(
        &self,
        ctx: &Context<'_>,
        id: ID,
        start_time: i64,
        end_time: i64,
        category_id: ID,
    ) -> Result<Period<A>> {
        require_writable(ctx)?;
        if start_time >= end_time {
            return Err(anyhow!("start_time must be before end_time"));
        }
        let existing = self
            .app
            .db()
            .get_periods(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Period with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;
        self.app
            .db()
            .get_categories(&[&category_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Category {:?} not found", &category_id))?;

        self.app
            .db()
            .update_period(
                &id,
                db::PeriodUpdateShape::TimeCategory {
                    start_time,
                    end_time,
                    category_id: &category_id,
                },
            )
            .await?;

        let rec = self.app.db().get_periods(&[&id]).await?;
        let period = rec
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Period with ID {:?} missing", &id))?;

        enqueue_nitc_export(&self.app.sqs().nitc_export, &period.id).await;
        Ok(Period::new(period))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn delete_period(&self, ctx: &Context<'_>, id: ID) -> Result<bool> {
        require_writable(ctx)?;
        let existing = self
            .app
            .db()
            .get_periods(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Period with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;

        self.app
            .db()
            .update_period(&id, db::PeriodUpdateShape::Delete)
            .await?;
        enqueue_nitc_export(&self.app.sqs().nitc_export, &id).await;
        Ok(true)
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn create_session(
        &self,
        ctx: &Context<'_>,
        name: String,
        location_id: ID,
        config: Option<String>,
        healthcheck_url: Option<String>,
    ) -> Result<Session<A>> {
        require_writable(ctx)?;
        require_location_access(ctx, &location_id)?;
        self.app
            .db()
            .get_locations(&[&location_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Location {:?} not found", &location_id))?;

        let config = parse_session_config_json(config.as_deref())?;
        let healthcheck_url = normalize_healthcheck_url(healthcheck_url.as_deref())?;
        let item = self
            .app
            .db()
            .create_session(&location_id, &name, &config, healthcheck_url.as_deref())
            .await?;

        Ok(Session::new(item))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn create_api_token(
        &self,
        ctx: &Context<'_>,
        name: String,
        location_grants: Vec<String>,
        read_only: bool,
        expires_at: Option<i64>,
    ) -> Result<CreateApiTokenResult> {
        require_writable(ctx)?;
        let user_id = match ctx.data_opt::<AuthInfo>() {
            Some(AuthInfo::User { id, .. }) => id.clone(),
            _ => return Err(anyhow!("Super user auth required")),
        };
        if name.trim().is_empty() {
            return Err(anyhow!("name is required"));
        }
        if !location_grants.is_empty() {
            let found = self
                .app
                .db()
                .get_locations(location_grants.as_slice())
                .await?;
            for (id, loc) in location_grants.iter().zip(found.iter()) {
                if loc.is_none() {
                    return Err(anyhow!("Location {:?} not found", id));
                }
            }
        }
        let expires_at = expires_at
            .and_then(|ts| u64::try_from(ts).ok())
            .filter(|&ts| ts > 0);

        let (secret, token_hash) = auth::generate_api_token_secret();
        let rec = self
            .app
            .db()
            .create_api_token(
                &name,
                &token_hash,
                location_grants,
                read_only,
                expires_at,
                &user_id,
            )
            .await?;

        Ok(CreateApiTokenResult {
            token: ApiToken::new(rec),
            secret,
        })
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn update_api_token(
        &self,
        ctx: &Context<'_>,
        id: ID,
        name: String,
        location_grants: Vec<String>,
        read_only: bool,
        expires_at: Option<i64>,
    ) -> Result<ApiToken> {
        require_writable(ctx)?;
        if name.trim().is_empty() {
            return Err(anyhow!("name is required"));
        }
        if !location_grants.is_empty() {
            let found = self
                .app
                .db()
                .get_locations(location_grants.as_slice())
                .await?;
            for (id, loc) in location_grants.iter().zip(found.iter()) {
                if loc.is_none() {
                    return Err(anyhow!("Location {:?} not found", id));
                }
            }
        }
        let expires_at = expires_at
            .and_then(|ts| u64::try_from(ts).ok())
            .filter(|&ts| ts > 0);

        self.app
            .db()
            .update_api_token(
                &id,
                db::ApiTokenUpdateShape::Fields {
                    name: &name,
                    location_grants,
                    read_only,
                    expires_at,
                },
            )
            .await?;

        let rec = self
            .app
            .db()
            .get_api_token(&id)
            .await?
            .ok_or_else(|| anyhow!("ApiToken with ID {:?} missing", &id))?;
        Ok(ApiToken::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn revoke_api_token(&self, ctx: &Context<'_>, id: ID) -> Result<bool> {
        require_writable(ctx)?;
        self.app
            .db()
            .update_api_token(&id, db::ApiTokenUpdateShape::Revoke)
            .await?;
        Ok(true)
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn update_session(
        &self,
        ctx: &Context<'_>,
        id: ID,
        name: String,
        config: Option<String>,
        healthcheck_url: Option<String>,
    ) -> Result<Session<A>> {
        require_writable(ctx)?;
        let existing = self
            .app
            .db()
            .get_sessions(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Session with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;

        let config = parse_session_config_json(config.as_deref())?;
        let healthcheck_url = normalize_healthcheck_url(healthcheck_url.as_deref())?;
        self.app
            .db()
            .update_session(
                &id,
                db::SessionUpdateShape::Fields {
                    name: &name,
                    config: &config,
                    healthcheck_url: healthcheck_url.as_deref(),
                },
            )
            .await?;

        let rec = self.app.db().get_sessions(&[&id]).await?;
        Ok(Session::new(rec.into_iter().next().flatten().ok_or_else(
            || anyhow!("Session with ID {:?} missing", &id),
        )?))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn delete_session(&self, ctx: &Context<'_>, id: ID) -> Result<bool> {
        require_writable(ctx)?;
        let existing = self
            .app
            .db()
            .get_sessions(&[&id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Session with ID {:?} missing", &id))?;
        require_location_access(ctx, &existing.location_id)?;

        self.app
            .db()
            .update_session(&id, db::SessionUpdateShape::Delete)
            .await?;
        Ok(true)
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn create_location(
        &self,
        name: String,
        nitc_enabled: Option<i64>,
    ) -> Result<Location<A>> {
        let nitc_enabled = nitc_enabled
            .and_then(|ts| u64::try_from(ts).ok())
            .filter(|&ts| ts > 0);
        let rec = self
            .app
            .db()
            .create_location(&name, nitc_enabled, None)
            .await?;

        Ok(Location::new_db(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn update_location(
        &self,
        id: ID,
        name: String,
        enabled: bool,
        nitc_enabled: Option<i64>,
    ) -> Result<Location<A>> {
        let nitc_enabled = nitc_enabled
            .and_then(|ts| u64::try_from(ts).ok())
            .filter(|&ts| ts > 0);
        self.app
            .db()
            .update_location(
                &id,
                db::LocationUpdateShape::Fields {
                    name: &name,
                    enabled,
                    nitc_enabled,
                },
            )
            .await?;

        let rec = self.app.db().get_locations(&[&id]).await?;
        Ok(Location::new_db(
            rec.into_iter()
                .next()
                .flatten()
                .ok_or_else(|| anyhow!("Location with ID {:?} missing", &id))?,
        ))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn create_category(
        &self,
        name: String,
        nitc_group_id: Option<String>,
        nitc_participant_type: Option<String>,
    ) -> Result<Category<A>> {
        let nitc_group_id = nitc_group_id.as_deref().filter(|s| !s.is_empty());
        let nitc_participant_type = nitc_participant_type.as_deref().filter(|s| !s.is_empty());
        let item = self
            .app
            .db()
            .create_category(&name, nitc_group_id, nitc_participant_type)
            .await?;
        Ok(Category::new(item))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn update_category(
        &self,
        id: ID,
        name: String,
        enabled: bool,
        nitc_group_id: Option<String>,
        nitc_participant_type: Option<String>,
    ) -> Result<Category<A>> {
        let nitc_group_id = nitc_group_id.as_deref().filter(|s| !s.is_empty());
        let nitc_participant_type = nitc_participant_type.as_deref().filter(|s| !s.is_empty());
        self.app
            .db()
            .update_category(&id, &name, enabled, nitc_group_id, nitc_participant_type)
            .await?;

        let rec = self.app.db().get_categories(&[&id]).await?;
        Ok(Category::new(rec.into_iter().next().flatten().ok_or_else(
            || anyhow!("Category with ID {:?} missing", &id),
        )?))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn create_nitc_group(
        &self,
        id: Option<String>,
        nitc_type: String,
        nitc_tag_ids: Vec<i32>,
    ) -> Result<NitcGroup<A>> {
        let id_ref = id.as_deref().filter(|s| !s.is_empty());
        let rec = self
            .app
            .db()
            .create_nitc_group(id_ref, &nitc_type, &nitc_tag_ids)
            .await?;
        Ok(NitcGroup::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn update_nitc_group(
        &self,
        id: ID,
        nitc_type: String,
        nitc_tag_ids: Vec<i32>,
    ) -> Result<NitcGroup<A>> {
        self.app
            .db()
            .update_nitc_group(&id, &nitc_type, &nitc_tag_ids)
            .await?;
        let rec = self
            .app
            .db()
            .get_nitc_group(&id)
            .await?
            .ok_or_else(|| anyhow!("NitcGroup with ID {:?} missing", &id))?;
        Ok(NitcGroup::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::SuperUser)")]
    async fn delete_nitc_group(&self, id: ID) -> Result<bool> {
        self.app.db().delete_nitc_group(&id).await?;
        Ok(true)
    }

    // scan functions
    #[graphql(guard = "AuthGuard::new(AuthRequirement::Session)")]
    async fn scan_register2(
        &self,
        ctx: &Context<'_>,
        #[graphql(name = "memberNumber")] registration_number: String,
    ) -> Result<RegisterResult<A>> {
        require_writable(ctx)?;
        let auth = ctx.data_opt::<AuthInfo>();
        let location_id = match auth {
            Some(AuthInfo::Session { location, .. }) => location,
            _ => {
                return Err(anyhow!("Cannot call scan_register2 without session auth"));
            }
        };

        let Some(person_id) = self
            .app
            .db()
            .get_person_id_by_registration_number(&registration_number)
            .await?
        else {
            return Ok(RegisterResult {
                state: RegisterState::NotFound,
                period: None,
            });
        };

        // lookup most recent unfinished period for this person scoped to this session's location
        let existing_unfinished_period = self
            .app
            .db()
            .list_periods_for_person(
                &person_id,
                Some(location_id),
                Some(true),
                db::ListPeriodsPage {
                    after: None,
                    before: None,
                    limit: 10,
                    descending: true,
                },
            )
            .await?
            .into_iter()
            .next();

        if let Some(period) = existing_unfinished_period {
            // already signed in — return pending state without modifying the period
            Ok(RegisterResult {
                state: RegisterState::SignOutPending,
                period: Some(Period::new(period)),
            })
        } else {
            // no existing unfinished period, so sign them in
            let rec = self
                .app
                .db()
                .start_period_for_person_location(&person_id, location_id)
                .await?;

            Ok(RegisterResult {
                state: RegisterState::SignedIn,
                period: Some(Period::new(rec)),
            })
        }
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::Session)")]
    async fn scan_sign_out(
        &self,
        ctx: &Context<'_>,
        id: ID,
        start_time: i64,
        end_time: i64,
        category_id: ID,
    ) -> Result<Period<A>> {
        require_writable(ctx)?;
        if start_time >= end_time {
            return Err(anyhow!("start_time must be before end_time"));
        }
        let rec = self.app.db().get_periods(&[&id]).await?;
        let mut rec = rec
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Period with ID {:?} missing", &id))?;
        require_location_access(ctx, &rec.location_id)?;
        self.app
            .db()
            .get_categories(&[&category_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Category {:?} not found", &category_id))?;
        self.app
            .db()
            .update_period(
                &rec.id,
                db::PeriodUpdateShape::TimeCategory {
                    start_time,
                    end_time,
                    category_id: &category_id,
                },
            )
            .await?;
        rec.start_time = start_time as u64;
        rec.end_time = Some(end_time as u64);
        rec.category_id = Some(category_id.to_string());

        enqueue_nitc_export(&self.app.sqs().nitc_export, &rec.id).await;
        Ok(Period::new(rec))
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn enqueue_member_sync(&self, location_id: ID) -> Result<bool> {
        self.app
            .db()
            .get_locations(&[&location_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("Location {:?} not found", &location_id))?;
        let sqs = &self.app.sqs().member_sync;
        crate::sqs_dispatch::enqueue_location_sync(&sqs.client, &sqs.queue_url, &location_id)
            .await?;
        Ok(true)
    }

    #[graphql(guard = "AuthGuard::new(AuthRequirement::User)")]
    async fn update_my_email_config(
        &self,
        ctx: &Context<'_>,
        daily_location_ids: Vec<String>,
    ) -> Result<User<A>> {
        require_writable(ctx)?;
        let user_id = match ctx.data_opt::<AuthInfo>() {
            Some(AuthInfo::User { id, .. }) => id.clone(),
            _ => return Err(anyhow!("User auth required")),
        };

        let mut email_config = serde_json::Map::new();
        for loc_id in daily_location_ids {
            let mut inner = serde_json::Map::new();
            inner.insert(
                "daily".to_string(),
                serde_json::Value::String("1".to_string()),
            );
            email_config.insert(loc_id, serde_json::Value::Object(inner));
        }

        self.app
            .db()
            .update_user(&user_id, db::UserUpdateShape::EmailConfig { email_config })
            .await?;

        let rec = self
            .app
            .db()
            .get_users(&[&user_id])
            .await?
            .into_iter()
            .next()
            .flatten()
            .ok_or_else(|| anyhow!("User missing after update"))?;
        Ok(User::new(rec))
    }
}
