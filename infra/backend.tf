terraform {
  backend "s3" {
    bucket  = "seslogin-terraform-state"
    key     = "seslogin/terraform.tfstate"
    region  = "ap-southeast-2"
    encrypt = true
  }
}
