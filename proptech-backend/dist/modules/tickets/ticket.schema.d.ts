import { z } from "zod";
export declare const createTicketSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    tenantId: z.ZodString;
    propertyId: z.ZodString;
    technicianId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    tenantId: string;
    propertyId: string;
    technicianId?: string | undefined;
}, {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    tenantId: string;
    propertyId: string;
    technicianId?: string | undefined;
}>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export declare const assignTechnicianSchema: z.ZodObject<{
    technicianId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    technicianId: string;
}, {
    technicianId: string;
}>;
export type AssignTechnicianInput = z.infer<typeof assignTechnicianSchema>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["OPEN", "ASSIGNED", "IN_PROGRESS", "DONE"]>;
    actorId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "DONE";
    actorId: string;
}, {
    status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "DONE";
    actorId: string;
}>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
//# sourceMappingURL=ticket.schema.d.ts.map