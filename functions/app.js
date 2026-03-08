const express = require("express");
const cors = require("cors");

function getAllowedOrigins() {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([
    "https://assignment4-54794.web.app",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    ...configuredOrigins,
  ]);
}

function createCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  };
}

function createApp({ db, admin, logger }) {
  const app = express();

  app.use(cors(createCorsOptions()));
  app.use(express.json());

  // GET - API root (prevents "Cannot GET /" when opening the base URL in a browser)
  app.get("/", (req, res) => {
    res.status(200).json({
      ok: true,
      message: "Firebase Serverless REST API is running",
    });
  });

  // GET - Quick health check
  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, message: "API is running" });
  });

  // GET - List comments (newest first)
  app.get("/comments", async (req, res) => {
    try {
      const snap = await db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const comments = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          handle: data.handle,
          text: data.text,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        };
      });

      res.status(200).json(comments);
    } catch (err) {
      logger.error("GET /comments failed", err);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // POST - New comment
  app.post("/comments", async (req, res) => {
    try {
      const handle = String(req.body?.handle ?? "").trim();
      const text = String(req.body?.text ?? "").trim();

      if (!handle || !text) {
        return res.status(400).json({ error: "handle and text are required" });
      }

      // Block hacker handle
      let normalized = handle.toLowerCase();
      if (normalized.startsWith("@")) normalized = normalized.slice(1);

      if (normalized === "hacker") {
        return res.status(400).json({ error: "Handle not allowed" });
      }

      const docRef = await db.collection("comments").add({
        handle,
        text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(201).json({ id: docRef.id });
    } catch (err) {
      logger.error("POST /comments failed", err);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  return app;
}

module.exports = { createApp };