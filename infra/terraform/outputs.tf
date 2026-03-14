output "project_id" {
  description = "GCP project ID targeted by this Terraform configuration."
  value       = var.project_id
}

output "region" {
  description = "Default region configured for the Google provider."
  value       = var.region
}

output "enabled_services" {
  description = "GCP services managed by this Terraform configuration."
  value       = sort(tolist(local.required_services))
}

output "terraform_scope" {
  description = "What this Terraform slice is responsible for."
  value       = "Enables core GCP services that support the Firebase serverless app."
}