import test from "node:test";
import assert from "node:assert/strict";
import { createPropertySchema } from "./property.schema.js";
test("createPropertySchema validates required fields", () => {
    const result = createPropertySchema.safeParse({
        name: "Building A",
        address: "123 Main St",
        managerId: "manager-1",
    });
    assert.equal(result.success, true);
});
//# sourceMappingURL=property.schema.test.js.map