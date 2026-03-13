import test from "node:test";
import assert from "node:assert/strict";
import { listNotificationsQuerySchema } from "./notification.schema.js";
test("listNotificationsQuerySchema accepts optional userId", () => {
    const result = listNotificationsQuerySchema.safeParse({});
    assert.equal(result.success, true);
});
//# sourceMappingURL=notification.schema.test.js.map