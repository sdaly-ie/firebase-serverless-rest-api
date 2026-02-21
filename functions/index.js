// Cloud API (Firebase Functions v2, Express REST API & Firestore)

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");
const { createApp } = require("./app");

// Start Firebase Admin (once)
admin.initializeApp();
const db = admin.firestore();

// Limit to 1 instance for cost & debugging
setGlobalOptions({ maxInstances: 1 });

// Build Express app (routes/middleware live in app.js)
const app = createApp({ db, admin, logger });

// Make API available on the web
exports.api = onRequest(app);