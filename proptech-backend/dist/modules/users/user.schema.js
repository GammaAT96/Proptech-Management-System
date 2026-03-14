import { z } from "zod";
export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["TENANT", "MANAGER", "TECHNICIAN", "ADMIN"]),
});
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(["TENANT", "MANAGER", "TECHNICIAN", "ADMIN"]).optional(),
});
//# sourceMappingURL=user.schema.js.map