import { z } from "zod";

export const listNotificationsQuerySchema = z.object({
  userId: z.string().min(1).optional(),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;

