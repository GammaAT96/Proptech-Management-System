import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  tenantId: z.string().min(1, "tenantId is required"),
  propertyId: z.string().min(1, "propertyId is required"),
  technicianId: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const assignTechnicianSchema = z.object({
  technicianId: z.string().min(1, "technicianId is required"),
});

export type AssignTechnicianInput = z.infer<typeof assignTechnicianSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "DONE"]),
  actorId: z.string().min(1).optional(),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

