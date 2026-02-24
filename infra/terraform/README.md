\# Terraform Scaffold



This folder is a small Infrastructure as Code (IaC) scaffold to demonstrate:

\- Terraform structure, such as versions, providers, variables and outputs

\- CI quality gates like `terraform fmt` \& `terraform validate`



Note: This scaffold however does not provision AWS resources and does not manage Firebase/GCP.

Instead it exists to demonstrate Terraform/IaC patterns without credentials in CI.



\## Local commands

From this folder:



terraform fmt -recursive

terraform init -backend=false

terraform validate

