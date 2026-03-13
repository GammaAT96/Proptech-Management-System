import test from "node:test";
import assert from "node:assert/strict";

test("prisma singleton reuses global in dev/test", async () => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/db";

  const m1 = await import("./prisma.js");
  const m2 = await import("./prisma.js");

  assert.ok(m1.prisma);
  assert.ok(m2.prisma);
  assert.equal(m1.prisma, m2.prisma);
});

