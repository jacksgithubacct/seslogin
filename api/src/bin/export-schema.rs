use anyhow::Result;
use std::sync::Arc;

use seslogin::app;
use seslogin::graphql;
use seslogin::jwt;
use seslogin::mockdb;
use seslogin::sqs_dispatch::{SqsQueue, SqsQueues};

#[tokio::main]
async fn main() -> Result<()> {
    let key = jwt::Key::new("schema-export", None, None)?;
    let db = mockdb::Handler::new();
    let aws_cfg = aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;
    let sqs_client = aws_sdk_sqs::Client::new(&aws_cfg);
    let sqs = SqsQueues {
        member_sync: SqsQueue {
            client: sqs_client.clone(),
            queue_url: String::new(),
        },
        nitc_export: SqsQueue {
            client: sqs_client.clone(),
            queue_url: String::new(),
        },
        healthcheck: SqsQueue {
            client: sqs_client,
            queue_url: String::new(),
        },
    };
    let app = Arc::new(app::new(db, key, 0, sqs));
    let schema = graphql::build_schema(app);

    print!("{}", schema.sdl());

    Ok(())
}
