resource "aws_sqs_queue" "nitc_export_dlq" {
  name                      = "seslogin-nitc-export-dlq"
  message_retention_seconds = 1209600 # 14 days
}

resource "aws_sqs_queue" "nitc_export" {
  name                       = "seslogin-nitc-export"
  visibility_timeout_seconds = 360 # must be >= lambda timeout

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.nitc_export_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_cloudwatch_metric_alarm" "nitc_dlq_not_empty" {
  alarm_name          = "seslogin-nitc-export-dlq-not-empty"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "NITC export DLQ has messages — NITC exports are failing"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.member_sync_alerts.arn]
  ok_actions    = [aws_sns_topic.member_sync_alerts.arn]

  dimensions = {
    QueueName = aws_sqs_queue.nitc_export_dlq.name
  }
}
