variable "aws_region" {
  description = "AWS region used for Terraform init and validate scaffold."
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Used for tagging and naming in the scaffold."
  type        = string
  default     = "firebase-serverless-rest-api"
}

variable "env" {
  description = "Environment tag for the scaffold."
  type        = string
  default     = "demo"
}