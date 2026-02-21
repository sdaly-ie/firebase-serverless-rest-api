
# Firebase Serverless REST API Demo

A small end-to-end demo with a simple website hosted on Firebase, which calls a REST API that runs on Firebase Cloud Functions, and stores comments in Firestore.

## Live Demo
- Website (Firebase Hosting): https://assignment4-54794.web.app/
- Website (custom link): https://s-daly.ie/firebase-serverless-rest-api
- API health check: https://us-central1-assignment4-54794.cloudfunctions.net/api/health

## What this project shows
- A static website (HTML5/CSS3/JavaScript) deployed with Firebase Hosting
- A serverless REST API built with Cloud Functions v2 & Express
- A Firestore database used to store and load comments
- Basic validation and safe display of user input

## REST API (endpoints)

Base URL:
- https://us-central1-assignment4-54794.cloudfunctions.net/api

### `GET /health`
Quick check that the API is running.

Expected response:
```json
{ "ok": true, "message": "API is running" }
```

### `GET /comments`
Returns the latest comments (newest first).

Example response:
```json
[
  {
    "id": "c4fdZfsbycWuJMTK4Je2",
    "handle": "@stephen",
    "text": "Posting from Postman",
    "createdAt": "2026-02-07T20:20:25.524Z"
  },
  {
    "id": "ZNHt26EtMZPlDnsvPErB",
    "handle": "@stephen",
    "text": "Posting from Postman",
    "createdAt": "2026-02-07T20:08:16.409Z"
  },
  {
    "id": "m8n9SRzA4IcnuT4ZiNwg",
    "handle": "@stephen",
    "text": "Posting from Postman",
    "createdAt": "2026-02-07T20:07:34.227Z"
  },
  {
    "id": "jyidibHeerOri4hrjYdb",
    "handle": "@trailrunner23",
    "text": "Great run today!",
    "createdAt": "2026-02-07T19:30:18.671Z"
  },
  {
    "id": "f9ZQZaWe1yGiwWwX0rkQ",
    "handle": "@stephen",
    "text": "Transitioned from local testing to cloud-deployed REST API — end-to-end verification complete.",
    "createdAt": "2026-02-03T23:51:45.637Z"
  },
  {
    "id": "bLxcGzKTV3Oo9xlxLuKS",
    "handle": "@stephen",
    "text": "Hello is there anybody out there?",
    "createdAt": "2026-02-03T23:40:14.610Z"
  },
  {
    "id": "6xfbq1EPXqEu50IwYjqU",
    "handle": "@stephen",
    "text": "Posting from Postman",
    "createdAt": "2026-02-03T23:13:05.495Z"
  }
]
```

### `POST /comments`
Creates a new comment.

Example request body:
```json
{ "handle": "@trailrunner23", "text": "Great run today!" }
```

After posting a comment, it appears in the Latest comments list (end-to-end check from website → API → Firestore → website).

![Website after posting a comment](public/images/postcomment.jpg)

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

## Basic checks and safety
- Requires both `handle` and `text`
- Blocks the handle `hacker` (checked on the website and again on the API)
- Displays comments as **text**, not as “web code” (prevents HTML/script injection)
- Limits the function to 1 instance (`maxInstances: 1`) to control cost and keep debugging simple

## Tech Stack
- Firebase Hosting
- Firebase Cloud Functions v2 (Node.js) + Express
- Firestore
- HTML / CSS / JavaScript

## Project Structure
- `public/` — website files (HTML/CSS/JS/images)
- `functions/` — API code (Express app deployed as a Cloud Function)
- `firebase.json` / `.firebaserc` — Firebase project configuration

## Engineering Quality and Local Runbook

This repository is being improved using a feature-branch workflow to increase engineering quality and platform-readiness, while preserving the existing public API contract and employer-facing demo links.

### Engineering quality improvements (current)
- Dependabot for npm and GitHub Actions dependency updates
- ESLint for `functions/`
- GitHub Actions Continuous Integration (CI) to run lint checks on push and pull request

### Local quality checks (Functions)
Run these commands from the `functions/` folder:

```bash
npm ci
npm run lint
```

### CI checks (GitHub Actions)
CI runs automatically on:
- pushes to `main`
- pushes to `feature/platform-readiness`
- pull requests

### Production safety note
Changes are developed and tested on a feature branch before any production deploy.

To protect the live demo and employer-facing links, public endpoints are being preserved during upgrades:
- `GET /health`
- `GET /comments`
- `POST /comments`

### Troubleshooting
- If lint fails due to missing config, check that `functions/eslint.config.cjs` exists
- If dependencies behave unexpectedly, delete `functions/node_modules` and run `npm ci` again
- Avoid running `npm audit fix --force` during structured upgrade commits unless intentionally planned

## Run locally (Firebase emulators)
Prereqs: Node.js + Firebase CLI

```bash
cd functions
npm ci
npm run lint
cd ..
firebase emulators:start --only functions,firestore,hosting
```

## Deploy (Hosting + Functions)
```bash
firebase deploy --only hosting,functions
```

## Engineering Quality (Platform Readiness)

This project includes a small platform-readiness upgrade to improve maintainability and reliability without changing the public API contract.

### What was added
- **ESLint** for JavaScript code quality checks (`functions/`)
- **Jest + Supertest** automated tests for core API routes
- **GitHub Actions CI** to run checks on push and pull request
- **Dependabot** for dependency update monitoring (npm + GitHub Actions)

### Local quality checks (recommended before pushing)
From the `functions/` folder:

```bash
npm ci
npm run lint
npm test

## Why I built this
To practice building, validating, and deploying a small end-to-end cloud application: web UI, REST API, database, and hosting/functions deployment on Firebase.