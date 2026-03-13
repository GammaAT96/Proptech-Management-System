import { z } from "zod";
export declare const listNotificationsQuerySchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId?: string | undefined;
}, {
    userId?: string | undefined;
}>;
export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;
//# sourceMappingURL=notification.schema.d.ts.map