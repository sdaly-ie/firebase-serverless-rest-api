# Firebase Serverless REST API Demo

[![Deployed API Smokecheck (Go)](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/deployed-smokecheck-go.yml/badge.svg)](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/deployed-smokecheck-go.yml)
[![Functions CI](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/functions-ci.yml/badge.svg)](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/functions-ci.yml)
[![Docker Functions CI](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/docker-functions-ci.yml/badge.svg)](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/docker-functions-ci.yml)
[![Terraform (fmt, validate & lint)](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/terraform-validate.yml/badge.svg)](https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/terraform-validate.yml)

A small end-to-end demo of a static site on Firebase Hosting calling a serverless REST API (Cloud Functions v2 + Express) that stores comments in Firestore.

## Quality gates and automation checks

This repo is designed to show more than a basic Firebase demo. It demonstrates a small deployed cloud application with live runtime verification, multiple automated API assurance layers, a narrow but real Infrastructure as Code (IaC) slice, and practical security/dependency hygiene.

> **For reviewers:** Start with **[v1.8.1 – Review Snapshot](https://github.com/sdaly-ie/firebase-serverless-rest-api/releases/tag/v1.8.1)** (stable).
> The `main` branch may include ongoing updates.
> Initial snapshot: **v1.0.0**.

## Key reviewer links

- **Review snapshot:** https://github.com/sdaly-ie/firebase-serverless-rest-api/releases/tag/v1.8.1
- **Live demo:** https://assignment4-54794.web.app/
- **Swagger UI:** https://assignment4-54794.web.app/swagger/
- **OpenAPI YAML:** https://assignment4-54794.web.app/openapi/openapi.yaml
- **API health check:** https://us-central1-assignment4-54794.cloudfunctions.net/api/health
- **Go smokecheck workflow:** https://github.com/sdaly-ie/firebase-serverless-rest-api/actions/workflows/deployed-smokecheck-go.yml

## What this repo demonstrates

- A deployed end-to-end Firebase application using Hosting, Cloud Functions v2, and Firestore
- API documentation and contract visibility through OpenAPI and Swagger UI
- Multiple automated verification layers including Jest, Pact, Playwright, Newman, and a Go smokecheck
- Basic Infrastructure as Code and CI/CD-oriented project hygiene
- Security-minded practices including CodeQL, Dependency Review, Dependabot, controlled CORS configuration, and failure-only Slack alerts

## What's new in v1.8.1

- Fixed the OpenAPI comment contract so the spec now matches the live API field names: `handle` and `text`
- Updated OpenAPI examples and schemas to reflect the verified deployed comment payload shape, including `createdAt`
- Corrected the `POST /comments` OpenAPI success response so it now returns a new `id`
- Updated the README reviewer journey so reviewers can jump straight to the live Swagger UI and hosted OpenAPI YAML
- Corrected the Terraform default region from `europe-west1` to `us-central1`
- Refreshed dependencies with a safe patch update to `firebase-functions` and applied non-breaking `npm audit fix` updates
- Reviewed the remaining low-severity `@tootallnate/once` transitive advisory and left it unresolved rather than forcing a breaking downgrade of `firebase-admin`

**Previous release highlights**
- **v1.8.0** — added OpenAPI 3.0, Swagger UI, Postman collection, Postman environment, and a Newman GitHub Actions workflow
- **v1.7.0** — hardened the Go smokecheck, added unit tests, enforced `gofmt` / `go vet` / `go test`, and tightened CORS with an allowlist
- **v1.6.1** — replaced the old Terraform placeholder with real GCP service enablement
- **v1.6.0** — added Pact consumer and provider contract tests
- **v1.5.0** — added TypeScript Playwright deployed API automation checks
- **v1.4.0** — added CodeQL, Dependency Review, `SECURITY.md`, and dependency hygiene updates
- **v1.3.1** — improved reviewer path, evidence callout, and local quick start
- **v1.3.0** — strengthened the review snapshot with better reviewer flow and clearer operational evidence
- **v1.2.0** — added the deployed API smokecheck workflow and architecture/pipeline diagrams
- **v1.1.1** — fixed review snapshot wording for consistency
- **v1.1.0** — added the Terraform scaffold with CI format and validation checks
- **v1.0.0** — created the initial stable review snapshot for the live Firebase Hosting + Cloud Functions + Firestore demo

---

## Reviewer quick tour (2–3 minutes)

1. Open the **Live demo** and submit a comment to verify the full flow from UI -> API -> Firestore -> UI.
2. Open **Swagger UI** to inspect the live API contract and try the endpoints interactively.
3. Open the **Go smokecheck workflow** to see automated runtime verification of the live deployment.
4. Review the **Evidence** section below for the GitHub Actions smokecheck run and the Slack failure alert.
5. Open the **OpenAPI YAML** directly if you want the raw contract file used by Swagger UI.
6. Hit the **API health check** endpoint and confirm you receive `200 OK`.
7. Review `functions/` for API implementation and tests, then `tools/smokecheck-go/` for the Go runtime check.
8. Review `automation-tests-ts/` for TypeScript API automation checks against the deployed endpoint.

---

## Live demo

- **Website (Firebase Hosting):** https://assignment4-54794.web.app/
- **Swagger UI (live):** https://assignment4-54794.web.app/swagger/
- **OpenAPI YAML (live):** https://assignment4-54794.web.app/openapi/openapi.yaml
- **API health check:** https://us-central1-assignment4-54794.cloudfunctions.net/api/health

> UI note: The front-end is intentionally minimal and acts as a lightweight test harness to demonstrate end-to-end data flow and API operation rather than UI/UX polish.
> Docs note: Swagger UI and the hosted OpenAPI YAML are included so reviewers can validate the API quickly without needing to inspect the repo first.
> Note: A custom domain is not included because none is currently configured for this project.

---

## Automation / Ops

- **Runtime verification:** a scheduled and manual **Go smokecheck** validates the live `/api/health` endpoint (not just unit tests).
- **Go workflow quality gates:** the smokecheck workflow also runs `gofmt`, `go vet`, and `go test` before executing the deployed runtime check.
- **Failure visibility:** on smokecheck failure, a **Slack alert** posts to `#ci-alerts` (failure-only, no success spam).
- **CI quality gates:** lint + tests run on pushes and pull requests for `functions/`.

### Evidence

Below are screenshots of the live smokecheck workflow and the failure-only Slack alert.

**GitHub Actions: deployed smokecheck run**  
![GitHub Actions deployed smokecheck run](public/images/ops-actions-smokecheck.jpg)

**Slack: failure-only alert to `#ci-alerts`**  
![Slack smokecheck failure alert](public/images/ops-slack-alert.jpg)

---

## Runtime architecture

High-level deployed flow (Hosting -> Functions API -> Firestore):

![Runtime architecture](public/images/runtime-architecture.jpg)

Dev validation and deployed runtime check overview:

![Dev pipeline and ops checks](public/images/dev-pipeline-ops.jpg)

> Ops note: on smokecheck failure, GitHub Actions posts a Slack alert to `#ci-alerts`.

---

## Quick start (local)

**Prerequisites:** Node.js + Firebase CLI (`firebase-tools`)

```bash
cd functions
npm ci
npm run lint
npm test
cd ..
firebase emulators:start
```

This runs the Firebase Emulator Suite locally (Functions + Firestore + Hosting + Emulator UI) using the emulator settings in `firebase.json`.

**If emulators fail to start:** update Firebase CLI to the latest version.

```bash
npm install -g firebase-tools@latest
firebase --version
```

## Run the deployed API automation tests (TypeScript)

Prerequisites:
- Node.js 18+
- A deployed API base URL (example below)

Note: `DEPLOYED_BASE_URL` points to a public demo endpoint used only for automated read/write checks.

From the repo root:

### PowerShell (Windows)
```powershell
cd automation-tests-ts
npm ci
$env:DEPLOYED_BASE_URL="https://us-central1-assignment4-54794.cloudfunctions.net/api"
npx playwright test
```

### Bash (macOS/Linux)
```bash
cd automation-tests-ts
npm ci
export DEPLOYED_BASE_URL="https://us-central1-assignment4-54794.cloudfunctions.net/api"
npx playwright test
```

---

## Project structure

- [`public/`](public/) — website files (HTML/CSS/JS/images)
- [`functions/`](functions/) — API code (Express app deployed as a Cloud Function)
- [`functions/__tests__/`](functions/__tests__/) — Jest + Supertest API route tests
- [`automation-tests-ts/`](automation-tests-ts/) — TypeScript Playwright deployed API automation checks
- [`tools/smokecheck-go/`](tools/smokecheck-go/) — Go tool for deployed `/api/health` smokecheck
- [`infra/terraform/`](infra/terraform/) — Terraform for core GCP service enablement (fmt/validate/lint in CI)
- [`.github/workflows/`](.github/workflows/) — CI + ops workflows
- [`.github/dependabot.yml`](.github/dependabot.yml) — dependency update configuration
- `firebase.json` / `.firebaserc` — Firebase project configuration

---

## CI / Ops workflows (GitHub Actions)

- **Functions CI** — lint + tests on push and pull requests
- **Docker Functions CI** — lint + tests in a container for parity checks
- **Terraform (fmt, validate & lint)** — formatting, validation and lint checks for `infra/terraform`
- **Deployed API Smokecheck (Go)** — scheduled and manual live `/api/health` verification, with `gofmt`, `go vet`, and `go test` enforced before the runtime check
- **Postman Newman** — API regression and smoke execution using the Postman collection and environment

### Required GitHub Actions secrets

These are stored in **Repo -> Settings -> Secrets and variables -> Actions**.

- `DEPLOYED_HEALTH_URL` — deployed `/api/health` endpoint URL
- `SLACK_WEBHOOK_URL` — Slack Incoming Webhook for `#ci-alerts`

---

## REST API

**Base URL:**  
- https://us-central1-assignment4-54794.cloudfunctions.net/api

> If you open the base URL in a browser, you’ll see a small JSON response (`GET /`), which makes manual checks quicker.

### `GET /`
Convenience root route for quick browser checks.

Expected response:
```json
{ "ok": true, "message": "Firebase Serverless REST API is running" }
```

### `GET /health`
Quick check that the API is running.

Expected response:
```json
{ "ok": true, "message": "API is running" }
```

### `GET /comments`
Returns the latest comments (newest first).

<details>
<summary>Example response</summary>

```json
[
  {
    "id": "c4fdZfsbycWuJMTK4Je2",
    "handle": "@stephen",
    "text": "Posting from Postman",
    "createdAt": "2026-02-07T20:20:25.524Z"
  }
]
```
</details>

### `POST /comments`
Creates a new comment.

Example request body:
```json
{ "handle": "@trailrunner23", "text": "Great run today!" }
```

After posting a comment, it appears in the Latest comments list (end-to-end check from website -> API -> Firestore -> website).

![Website after posting a comment](public/images/postcomment.jpg)

---

## API contract and verification

This repo includes an OpenAPI 3.0 specification and Swagger UI for the deployed API.

### Files
- OpenAPI spec: `public/openapi/openapi.yaml`
- Swagger UI: `public/swagger/index.html`
- Postman collection: `postman/firebase-serverless-rest-api.postman_collection.json`
- Postman environment: `postman/firebase-serverless-rest-api.postman_environment.json`
- Newman workflow: `.github/workflows/postman-newman.yml`

### Test layer separation
- OpenAPI and Swagger: API contract and interactive documentation
- Postman and Newman: reviewer-friendly API regression and smoke checks
- Playwright: deployed endpoint automation
- Pact: consumer and provider contract verification
- Go smokecheck: lightweight live health verification

## Testing the API with Postman

You can test the API directly (without the website) using Postman.

### 1) Health check
- Method: `GET`
- URL: `https://us-central1-assignment4-54794.cloudfunctions.net/api/health`
- Expected: `200 OK` with JSON showing the API is running

![Expected result for GET /health](public/images/health.jpg)

### 2) List comments
- Method: `GET`
- URL: `https://us-central1-assignment4-54794.cloudfunctions.net/api/comments`
- Expected: `200 OK` with a JSON list (array) of comments

![Expected result for GET /comments](public/images/getcomment.jpg)

### 3) Create a comment
- Method: `POST`
- URL: `https://us-central1-assignment4-54794.cloudfunctions.net/api/comments`
- Header: `Content-Type: application/json`
- Body (raw JSON):
```json
{ "handle": "@trailrunner23", "text": "Posting from Postman" }
```
- Expected: `201 Created` with a JSON response containing a new `id`

![Expected result for POST /comments](public/images/pm-postcomment.jpg)

Quick check: run `GET /comments` again and confirm the new comment appears near the top.

---

## Basic checks and safety

- Requires both `handle` and `text`
- Blocks the handle `hacker` (validated on the website and again on the API)
- Displays comments as **text**, not rendered HTML/JavaScript (helps prevent script injection)
- Restricts cross-origin requests to approved deployed and local front-end origins
- Limits the function to 1 instance (`maxInstances: 1`) to control cost and keep debugging simple

---

## Terraform and Infrastructure as Code

The `infra/terraform` folder contains a deliberately narrow Terraform implementation for this repo.

It manages a small project-level Infrastructure as Code (IaC) slice by enabling core GCP services that support the Firebase serverless application, including Artifact Registry, Cloud Build, Cloud Functions, Firestore, Cloud Logging, Cloud Monitoring, and Cloud Run.

A dedicated GitHub Actions workflow checks this Terraform with:

- `terraform fmt -check -recursive`
- `terraform init -backend=false -input=false`
- `terraform validate -no-color`
- `tflint --format compact`

This Terraform does **not** manage:

- Firebase Hosting deployment
- Cloud Functions code deployment
- Firestore rules or indexes
- secrets management
- full environment provisioning

Those areas remain outside Terraform in this repo by design.

---

## Tech stack

- Firebase Hosting
- Firebase Cloud Functions v2 (Node.js) + Express
- Firestore
- HTML / CSS / JavaScript (minimal UI harness)

---

## Deploy (Hosting + Functions)

```bash
firebase deploy --only hosting,functions
```

---

## Why I built this

To practice building, validating and deploying a small end-to-end cloud application (UI, REST API, database, Firebase Hosting/Cloud Functions).

Also to demonstrate production-minded practices: CI lint/tests, container parity checks, Terraform-managed GCP service enablement with validation, deployed runtime smokechecks, and lightweight deployed-endpoint API automation checks (Playwright) with clear run instructions.
