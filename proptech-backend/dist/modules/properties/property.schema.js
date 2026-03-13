import { z } from "zod";
export const createPropertySchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    units: z.number().int().positive("Units must be a positive integer"),
    managerId: z.string().min(1, "managerId is required"),
});
//# sourceMappingURL=property.schema.js.map