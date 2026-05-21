resource "aws_sqs_queue" "member_sync_dlq" {
  name                      = "seslogin-member-sync-dlq"
  message_retention_seconds = 1209600 # 14 days
}

resource "aws_sqs_queue" "member_sync" {
  name                       = "seslogin-member-sync"
  visibility_timeout_seconds = 300 # must be >= sync lambda timeout

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.member_sync_dlq.arn
    maxReceiveCount     = 3
  })
}
