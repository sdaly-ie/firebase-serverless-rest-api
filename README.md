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

Endpoints:

- `GET /health`<br>  
  Returns a simple “API is running” message.<p>
  ![Expected result for GET /health screenshot](public/images/health.jpg)
  <br>
  <br>
- `GET /comments`<br>  
  Returns the latest comments (newest first).<p>
  ![Expected result for GET /comment screenshot](public/images/getcomment.jpg)
  <br>
  <br>
- `POST /comments`<br>  
  Creates a new comment.<p>
  Example body:<p>
  ```json  { "handle": "@trailrunner23", "text": "Great run today!" }```<p>
  After posting a comment, it appears in the Latest comments list.<p>
  ![Website after posting a comment screenshot](public/images/postcomment.jpg)
