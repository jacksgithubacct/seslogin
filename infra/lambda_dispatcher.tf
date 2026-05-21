resource "aws_lambda_function" "dispatcher" {
  function_name = "seslogin-dispatcher"
  role          = aws_iam_role.dispatcher_lambda.arn
  runtime       = "provided.al2023"
  handler       = "bootstrap"
  timeout       = 60
  filename      = "${path.module}/placeholder.zip"

  environment {
    variables = {
      DB_PREFIX             = var.db_prefix
      MEMBER_SYNC_QUEUE_URL = aws_sqs_queue.member_sync.url
    }
  }

  logging_config {
    log_format = "JSON"
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}
