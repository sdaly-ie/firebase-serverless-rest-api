import { test, expect } from "@playwright/test";

function extractItems(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.comments && Array.isArray(payload.comments)) return payload.comments;
  return [];
}

function extractId(payload: any): string | undefined {
  return (
    payload?.id ??
    payload?.data?.id ??
    payload?.comment?.id ??
    payload?.result?.id
  );
}

test("API automation: comments create and verify", async ({ request }) => {
  const unique = Date.now();
  const handle = "@automation-tests-ts";
  const text = `hello from automation tests ${unique}`;

  const createRes = await request.post("comments", { data: { handle, text } });
  expect([200, 201]).toContain(createRes.status());

  const createdPayload = await createRes.json();
  const createdId = extractId(createdPayload);

  // Some APIs do not echo fields back on create, so verify persistence via GET /comments.
  const listRes = await request.get("comments");
  expect(listRes.status()).toBe(200);

  const items = extractItems(await listRes.json());
  expect(items.length).toBeGreaterThan(0);

  const found =
    (createdId ? items.find((c: any) => c.id === createdId) : undefined) ||
    items.find((c: any) => c.handle === handle && c.text === text);

  expect(found).toBeTruthy();
  expect(found.handle).toBe(handle);
  expect(found.text).toBe(text);

  // Best-effort cleanup. Do not fail if delete is not supported.
  if (found?.id) {
    const delRes = await request.delete(`comments/${found.id}`);
    if ([200, 204].includes(delRes.status())) {
      const listRes2 = await request.get("comments");
      expect(listRes2.status()).toBe(200);
      const items2 = extractItems(await listRes2.json());
      expect(items2.find((c: any) => c.id === found.id)).toBeFalsy();
    }
  }
});