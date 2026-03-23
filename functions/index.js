// Cloud API (Firebase Functions v2, Express REST API & Firestore)
const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { createApp } = require("./app");

// Start Firebase Admin (once)
initializeApp();
const db = getFirestore();

// Limit to 1 instance for cost & debugging
setGlobalOptions({ maxInstances: 1 });

// Build Express app (routes/middleware live in app.js)
const app = createApp({ db, FieldValue, logger });

// Make API available on the web
exports.api = onRequest(app);