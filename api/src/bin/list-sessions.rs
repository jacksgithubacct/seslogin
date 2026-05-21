use anyhow::{Result, anyhow};
use clap::Parser;
use seslogin::db::{Handler, ListSessionsQuery};
use seslogin::dynamodb;
use seslogin::request_metrics::{self, RequestMetrics};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Parser, Debug)]
#[command(about = "List all sessions with location, client version, and last contact time")]
struct Cli {
    /// DynamoDB table prefix (e.g. "seslogin").
    #[arg(long)]
    db_prefix: Option<String>,
}

fn relative_time(epoch_secs: u64) -> String {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let secs = now.saturating_sub(epoch_secs);
    if secs < 120 {
        format!("{}s ago", secs)
    } else if secs < 7200 {
        format!("{}m ago", secs / 60)
    } else if secs < 86400 {
        format!("{}h ago", secs / 3600)
    } else {
        format!("{}d ago", secs / 86400)
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    dotenvy::from_filename(".env").ok();
    dotenvy::from_filename(".env.secret").ok();

    let cli = Cli::parse();

    let db_prefix = cli
        .db_prefix
        .or_else(|| std::env::var("DB_PREFIX").ok())
        .ok_or_else(|| anyhow!("DB_PREFIX is required (flag or env var)"))?;

    let db = dynamodb::Handler::new(&db_prefix, true).await;

    let metrics = Arc::new(RequestMetrics::default());
    request_metrics::METRICS
        .scope(metrics.clone(), async move {
            let locations = db
                .list_locations(seslogin::db::ListLocationsFilter::EnabledOnly)
                .await?;
            let location_map: std::collections::HashMap<_, _> = locations
                .iter()
                .map(|l| (l.id.clone(), l.name.clone()))
                .collect();

            let mut all_sessions = Vec::new();
            for loc in &locations {
                let sessions = db
                    .list_sessions(ListSessionsQuery::ByLocation(loc.id.clone()))
                    .await?;
                all_sessions.extend(sessions);
            }

            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs();
            let cutoff = now.saturating_sub(30 * 86400);

            all_sessions.retain(|s| s.last_contact.is_some_and(|t| t >= cutoff));
            all_sessions.sort_by_key(|s| s.last_contact.map(std::cmp::Reverse));

            println!(
                "{:<30} {:<25} {:<7} Last contact",
                "Session", "Location", "Version"
            );
            println!("{}", "-".repeat(75));

            for session in &all_sessions {
                let location_name = location_map
                    .get(&session.location_id)
                    .map(|s| s.as_str())
                    .unwrap_or("unknown");
                let version = session
                    .client_version
                    .as_deref()
                    .map(|v| &v[..v.len().min(7)])
                    .unwrap_or("-");
                let last_contact = session
                    .last_contact
                    .map(relative_time)
                    .unwrap_or_else(|| "never".to_string());

                println!(
                    "{:<30} {:<25} {:<7} {}",
                    session.name, location_name, version, last_contact
                );
            }

            anyhow::Ok(())
        })
        .await?;

    tracing::info!(
        "total rru={:.1} wru={:.1}",
        metrics.read_units(),
        metrics.write_units(),
    );

    Ok(())
}
