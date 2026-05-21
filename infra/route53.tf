data "aws_route53_zone" "seslogin" {
  zone_id = "Z2X4360EUGI76W"
}

resource "aws_route53_record" "prod_apex_a" {
  zone_id = data.aws_route53_zone.seslogin.zone_id
  name    = "seslogin.com"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.prod.domain_name
    zone_id                = aws_cloudfront_distribution.prod.hosted_zone_id
    evaluate_target_health = false
  }
}

# Does not currently exist in Route53 — Terraform will create it
resource "aws_route53_record" "prod_apex_aaaa" {
  zone_id = data.aws_route53_zone.seslogin.zone_id
  name    = "seslogin.com"
  type    = "AAAA"
  alias {
    name                   = aws_cloudfront_distribution.prod.domain_name
    zone_id                = aws_cloudfront_distribution.prod.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "prod_new_a" {
  zone_id = data.aws_route53_zone.seslogin.zone_id
  name    = "new.seslogin.com"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.prod.domain_name
    zone_id                = aws_cloudfront_distribution.prod.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "prod_new_aaaa" {
  zone_id = data.aws_route53_zone.seslogin.zone_id
  name    = "new.seslogin.com"
  type    = "AAAA"
  alias {
    name                   = aws_cloudfront_distribution.prod.domain_name
    zone_id                = aws_cloudfront_distribution.prod.hosted_zone_id
    evaluate_target_health = false
  }
}
