import { defineConfig } from "@playwright/test";

const raw = process.env.DEPLOYED_BASE_URL;

if (!raw) {
  throw new Error(
    "DEPLOYED_BASE_URL is not set. Example: https://us-central1-assignment4-54794.cloudfunctions.net/api"
  );
}

// Normalize so requests like request.get("health") always resolve to .../api/health
const baseURL = raw.endsWith("/") ? raw : `${raw}/`;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL,
    extraHTTPHeaders: {
      "content-type": "application/json"
    }
  },
  reporter: [["line"]]
});