import test from "node:test";
import assert from "node:assert/strict";
import { checkImageUrl } from "./check-images.js";

test("checkImageUrl returns ok: true for valid image URL", async () => {
  const result = await checkImageUrl(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
  );
  assert.equal(result.status, 200);
  assert.equal(result.ok, true);
  assert.match(result.contentType, /^image\//);
  assert.equal(result.error, null);
});

test("checkImageUrl flags 404 or non-existent URLs as ok: false", async () => {
  const result = await checkImageUrl("https://httpbin.org/status/404");
  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
  assert.match(result.error, /HTTP 404/);
});

test("checkImageUrl flags non-image content-type as ok: false", async () => {
  const result = await checkImageUrl("https://httpbin.org/html");
  assert.equal(result.ok, false);
  assert.match(result.error, /Non-image content-type/);
});
