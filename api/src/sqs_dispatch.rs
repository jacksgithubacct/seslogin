use anyhow::Result;
use aws_sdk_sqs::Client as SqsClient;
use serde_json::json;
use xxhash_rust::xxh64::xxh64;

pub const NUM_BUCKETS: u64 = 24;

pub struct SqsQueue {
    pub client: SqsClient,
    pub queue_url: String,
}

pub struct SqsQueues {
    pub member_sync: SqsQueue,
    pub nitc_export: SqsQueue,
    pub healthcheck: SqsQueue,
}
const EXPORT_DELAY: i32 = 60;

/// Assigns a location to a bucket (0..NUM_BUCKETS) based on a consistent hash of its ID.
/// The bucket number is stable across runs for the same location ID.
pub fn location_hour_bucket(location_id: &str) -> u64 {
    xxh64(location_id.as_bytes(), 0) % NUM_BUCKETS
}

pub async fn enqueue_period_nitc_export(
    client: &SqsClient,
    queue_url: &str,
    period_id: &str,
) -> Result<()> {
    let body = serde_json::to_string(&json!({"type": "period_export", "period_id": period_id}))?;
    client
        .send_message()
        .queue_url(queue_url)
        .message_body(body)
        .send()
        .await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;
    Ok(())
}

pub async fn enqueue_nitc_event_export(
    client: &SqsClient,
    queue_url: &str,
    event_id: &str,
    version: u64,
) -> Result<()> {
    let body = serde_json::to_string(
        &json!({"type": "event_export", "nitc_event_id": event_id, "version": version}),
    )?;
    client
        .send_message()
        .queue_url(queue_url)
        .message_body(body)
        .delay_seconds(EXPORT_DELAY)
        .send()
        .await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;
    Ok(())
}

pub async fn enqueue_healthcheck(
    client: &SqsClient,
    queue_url: &str,
    session_id: &str,
    healthcheck_url: &str,
) -> Result<()> {
    let body = serde_json::to_string(
        &json!({"session_id": session_id, "healthcheck_url": healthcheck_url}),
    )?;
    client
        .send_message()
        .queue_url(queue_url)
        .message_body(body)
        .send()
        .await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;
    Ok(())
}

pub async fn enqueue_location_sync(
    client: &SqsClient,
    queue_url: &str,
    location_id: &str,
) -> Result<()> {
    let body = serde_json::to_string(&serde_json::json!({"location_id": location_id}))?;
    client
        .send_message()
        .queue_url(queue_url)
        .message_body(body)
        .send()
        .await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bucket_is_in_range() {
        for id in ["abc", "xyz", "", "location-1", "12345"] {
            let b = location_hour_bucket(id);
            assert!(b < NUM_BUCKETS, "bucket {b} out of range for id {id:?}");
        }
    }

    #[test]
    fn bucket_is_stable() {
        let id = "some-location-id";
        assert_eq!(location_hour_bucket(id), location_hour_bucket(id));
    }

    #[test]
    fn distribution_covers_all_buckets() {
        // With 1000 sequential IDs the chance of missing any bucket is negligible.
        let mut seen = std::collections::HashSet::new();
        for i in 0u64..1000 {
            seen.insert(location_hour_bucket(&i.to_string()));
        }
        assert_eq!(seen.len(), NUM_BUCKETS as usize);
    }
}
