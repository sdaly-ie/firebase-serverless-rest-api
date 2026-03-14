# Terraform

This folder contains a deliberately small Infrastructure as Code (IaC) slice for the Firebase Serverless REST API project.

## What this Terraform covers

- Google provider configuration
- Input variables for project and region
- Project-level GCP service enablement for:
  - Artifact Registry
  - Cloud Build
  - Cloud Functions
  - Firestore
  - Cloud Logging
  - Cloud Monitoring
  - Cloud Run
- Terraform quality checks in CI:
  - `terraform fmt -check -recursive`
  - `terraform init -backend=false -input=false`
  - `terraform validate -no-color`
  - `tflint --format compact`

## What this Terraform does not cover

- Firebase Hosting deployment
- Cloud Functions code deployment
- Firestore rules or indexes
- secrets management
- full environment provisioning

Those parts remain outside Terraform for this repo and continue to be managed through the existing Firebase and application workflow.

## Local commands

From this folder:

```bash
terraform fmt -recursive
terraform init -backend=false -input=false
terraform validate -no-color
tflint --init
tflint --format compact
```
