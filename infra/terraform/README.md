# Terraform

This folder contains a small Infrastructure as Code (IaC) slice for the Firebase serverless REST API project.

It is responsible for enabling a core set of Google Cloud Platform (GCP) services used by the application platform, including Cloud Functions, Cloud Run-aligned services, Firestore, Cloud Build and Artifact Registry.

## What this Terraform covers

- Google provider configuration
- Input variables for project and region
- Project-level GCP service enablement
- Terraform formatting and validation in CI

## What this Terraform does not cover

- Firebase Hosting deployment
- Cloud Functions code deployment
- Firestore rules or indexes
- Secrets or full environment provisioning

Those parts remain outside Terraform for this repo and continue to be managed through the existing Firebase and application workflow.

## Local commands

From this folder:

```bash
terraform fmt -recursive
terraform init
terraform validate