variable "project_id" {
  description = "Google Cloud project ID used for service enablement."
  type        = string
}

variable "region" {
  description = "Primary Google Cloud region for Functions/Run-aligned services."
  type        = string
  default     = "us-central1"
}