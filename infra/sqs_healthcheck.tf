resource "aws_sqs_queue" "healthcheck" {
  name                       = "seslogin-healthcheck"
  visibility_timeout_seconds = 60 # must be >= healthcheck lambda timeout
}
