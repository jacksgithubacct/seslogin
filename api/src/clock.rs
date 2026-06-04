use std::time::SystemTime;

/// Current Unix time in whole seconds (UTC). Used for all created/updated/expiry timestamps.
pub fn now_sec() -> u64 {
    SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
