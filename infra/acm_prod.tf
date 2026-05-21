resource "aws_acm_certificate" "prod" {
  provider                  = aws.us_east_1
  domain_name               = "seslogin.com"
  subject_alternative_names = ["new.seslogin.com"]
  lifecycle { prevent_destroy = true }
}

# Cert is already ISSUED — import these existing validation CNAMEs, no re-validation needed
resource "aws_route53_record" "prod_cert_validation_apex" {
  zone_id = data.aws_route53_zone.seslogin.zone_id
  name    = "_065732478c7d7b5eeafb0ef34b0754b5.seslogin.com."
  type    = "CNAME"
  ttl     = 300
  records = ["_035f99e2bb37e24f4613b56545c58cde.jkddzztszm.acm-validations.aws."]
}

resource "aws_route53_record" "prod_cert_validation_new" {
  zone_id = data.aws_route53_zone.seslogin.zone_id
  name    = "_d03430df828b0ce53ba548cce90fa5ca.new.seslogin.com."
  type    = "CNAME"
  ttl     = 300
  records = ["_6ab4ac45f397998176105bb3962bb82d.xlfgrmvvlj.acm-validations.aws."]
}
