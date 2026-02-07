# Firebase Serverless REST API Demo

A small end-to-end demo with a simple website hosted on Firebase, which calls a REST API that runs on Firebase Cloud Functions, and stores comments in Firestore.

## Live Demo
- Website: https://assignment4-54794.web.app/
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

![Expected result for GET /comments](public/images/health.jpg)

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

## Run locally (Firebase emulators)
Prereqs: Node.js + Firebase CLI

```bash
cd functions
npm install
cd ..
firebase emulators:start --only functions,firestore,hosting
```

## Deploy (Hosting + Functions)
```bash
firebase deploy --only hosting,functions
```

## Why I built this
To practice building and deploying a small working system end-to-end: web UI, REST API, database, and cloud deployment.
