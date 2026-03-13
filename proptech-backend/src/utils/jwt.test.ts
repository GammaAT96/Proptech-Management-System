import test from "node:test";
import assert from "node:assert/strict";

import { signAccessToken, verifyAccessToken } from "./jwt.js";

test("jwt helper signs and verifies token", () => {
  process.env.JWT_SECRET = "test-secret";
  process.env.JWT_EXPIRES_IN = "5m";

  const token = signAccessToken({ userId: "u_123", role: "TENANT" });
  const decoded = verifyAccessToken(token);

  assert.equal(decoded.userId, "u_123");
  assert.equal(decoded.role, "TENANT");
  assert.ok(typeof decoded.iat === "number");
  assert.ok(typeof decoded.exp === "number");
});

test("jwt helper throws when secret missing", () => {
  delete process.env.JWT_SECRET;
  assert.throws(() => signAccessToken({ userId: "u_1", role: "TENANT" }), {
    message: "JWT_SECRET is required",
  });
});

