import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["TENANT", "MANAGER", "TECHNICIAN", "ADMIN"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN";
}, {
    name: string;
    email: string;
    password: string;
    role: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN";
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["TENANT", "MANAGER", "TECHNICIAN", "ADMIN"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    role?: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN" | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    role?: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN" | undefined;
}>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=user.schema.d.ts.map