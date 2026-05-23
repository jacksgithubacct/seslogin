mod errors;
mod handler;

use lambda_http::{Error, run, service_fn, tracing};
use seslogin::app;
use seslogin::auth;
use seslogin::db;
use seslogin::dynamodb;
use seslogin::graphql;
use seslogin::jwt;
use seslogin::sqs_dispatch::{SqsQueue, SqsQueues};
use std::env;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    // load JWT secret from env
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    let key = jwt::Key::new(&secret, None, None)?;

    let member_sync_queue_url =
        env::var("MEMBER_SYNC_QUEUE_URL").expect("MEMBER_SYNC_QUEUE_URL must be set");
    let nitc_export_queue_url =
        env::var("NITC_EXPORT_QUEUE_URL").expect("NITC_EXPORT_QUEUE_URL must be set");
    let healthcheck_queue_url =
        env::var("HEALTHCHECK_QUEUE_URL").expect("HEALTHCHECK_QUEUE_URL must be set");
    let aws_cfg = aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;
    let sqs_client = aws_sdk_sqs::Client::new(&aws_cfg);
    let sqs = SqsQueues {
        member_sync: SqsQueue {
            client: sqs_client.clone(),
            queue_url: member_sync_queue_url,
        },
        nitc_export: SqsQueue {
            client: sqs_client.clone(),
            queue_url: nitc_export_queue_url,
        },
        healthcheck: SqsQueue {
            client: sqs_client,
            queue_url: healthcheck_queue_url,
        },
    };

    let read_only = env::var("READ_ONLY")
        .map(|v| v == "true" || v == "1")
        .unwrap_or(false);

    let db_prefix = env::var("DB_PREFIX").expect("DB_PREFIX must be set for dynamodb backend");
    let db = dynamodb::Handler::new(&db_prefix, read_only).await;
    let app = Arc::new(app::new(db, key, 0, sqs));
    let webauthn = Arc::new(app::build_webauthn().expect("WebAuthn build failed"));
    let schema = graphql::build_schema(app.clone(), webauthn);
    let handler = handler::Handler::new(app, schema);
    run(service_fn(|req| handler.handle_request(req))).await
}
