import { test, expect } from "@playwright/test";

test("POST /comments rejects missing required fields", async ({ request }) => {
  const res = await request.post("comments", {
    data: { nonsense: true }
  });

  expect([400, 422]).toContain(res.status());

  const bodyText = await res.text();
  expect(bodyText).toMatch(/required/i);
});

test("GET /comments/:id returns 404 for unknown id (or fails safely)", async ({ request }) => {
  const res = await request.get("comments/does-not-exist-12345");

  // Depending on implementation, could be 404 or 400. Both are acceptable “safe failure”.
  expect([404, 400]).toContain(res.status());
});