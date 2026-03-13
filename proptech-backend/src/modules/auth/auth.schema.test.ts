import test from "node:test";
import assert from "node:assert/strict";

import { loginSchema, registerSchema } from "./auth.schema.js";

test("registerSchema requires valid data", () => {
  const result = registerSchema.safeParse({
    name: "Alice",
    email: "alice@example.com",
    password: "supersecret",
    role: "TENANT",
  });

  assert.equal(result.success, true);
});

test("loginSchema rejects missing password", () => {
  const result = loginSchema.safeParse({
    email: "alice@example.com",
  });

  assert.equal(result.success, false);
});

