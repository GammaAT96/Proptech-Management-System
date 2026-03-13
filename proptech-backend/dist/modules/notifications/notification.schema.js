import { z } from "zod";
export const listNotificationsQuerySchema = z.object({
    userId: z.string().min(1).optional(),
});
//# sourceMappingURL=notification.schema.js.map