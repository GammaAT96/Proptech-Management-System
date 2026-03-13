import test from "node:test";
import assert from "node:assert/strict";

import {
  assignTechnicianSchema,
  createTicketSchema,
  updateStatusSchema,
} from "./ticket.schema.js";

test("createTicketSchema validates required fields", () => {
  const result = createTicketSchema.safeParse({
    title: "Leaking faucet",
    description: "The kitchen faucet is leaking",
    priority: "HIGH",
    tenantId: "tenant-1",
    propertyId: "property-1",
  });

  assert.equal(result.success, true);
});

test("assignTechnicianSchema requires technicianId", () => {
  const result = assignTechnicianSchema.safeParse({});
  assert.equal(result.success, false);
});

test("updateStatusSchema accepts valid status", () => {
  const result = updateStatusSchema.safeParse({
    status: "IN_PROGRESS",
    actorId: "user-1",
  });
  assert.equal(result.success, true);
});

