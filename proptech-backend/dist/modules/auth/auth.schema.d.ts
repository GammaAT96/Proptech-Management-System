import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["TENANT", "MANAGER", "TECHNICIAN", "ADMIN"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN";
}, {
    name: string;
    email: string;
    password: string;
    role?: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN" | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
//# sourceMappingURL=auth.schema.d.ts.map