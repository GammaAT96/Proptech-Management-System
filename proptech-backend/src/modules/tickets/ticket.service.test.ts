import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../config/prisma.js";
import { listTicketsForManager } from "./ticket.service.js";

test("listTicketsForManager filters by property.managerId (manager cannot see another manager's tickets)", async () => {
  let capturedWhere: { property?: { managerId?: string } } | null = null;
  const originalFindMany = prisma.ticket.findMany.bind(prisma.ticket);
  const originalCount = prisma.ticket.count.bind(prisma.ticket);

  (prisma.ticket as any).findMany = async (args: { where?: typeof capturedWhere }) => {
    capturedWhere = args?.where ?? null;
    return [];
  };
  (prisma.ticket as any).count = async () => 0;

  try {
    const result = await listTicketsForManager("manager-123", 1, 20);
    assert.deepEqual(capturedWhere, {
      property: { managerId: "manager-123" },
    });
    assert.equal(Array.isArray(result.items), true);
    assert.equal(result.items.length, 0);
    assert.equal(typeof result.total, "number");
    assert.equal(result.total, 0);
    assert.equal(result.page, 1);
    assert.equal(result.limit, 20);
  } finally {
    (prisma.ticket as any).findMany = originalFindMany;
    (prisma.ticket as any).count = originalCount;
  }
});
