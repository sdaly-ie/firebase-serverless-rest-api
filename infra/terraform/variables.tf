variable "project_id" {
  description = "Google Cloud project ID used for service enablement."
  type        = string
}

variable "region" {
  description = "Primary Google Cloud region for Functions/Run-aligned services."
  type        = string
  default     = "us-central1"
}

variable "project_name" {
  description = "Project label used for documentation/output clarity."
  type        = string
  default     = "firebase-serverless-rest-api"
}

variable "env" {
  description = "Environment label for this Terraform slice."
  type        = string
  default     = "demo"
}