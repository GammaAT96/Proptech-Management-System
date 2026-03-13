import { z } from "zod";
export const createTicketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    tenantId: z.string().min(1, "tenantId is required"),
    propertyId: z.string().min(1, "propertyId is required"),
    technicianId: z.string().optional(),
});
export const assignTechnicianSchema = z.object({
    technicianId: z.string().min(1, "technicianId is required"),
});
export const updateStatusSchema = z.object({
    status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "DONE"]),
    actorId: z.string().min(1, "actorId is required"),
});
//# sourceMappingURL=ticket.schema.js.map