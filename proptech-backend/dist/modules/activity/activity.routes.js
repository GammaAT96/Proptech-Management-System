import { Router } from "express";
import { listTicketActivityHandler } from "./activity.controller.js";
export const activityRouter = Router();
/**
 * @swagger
 * /tickets/{id}/activity:
 *   get:
 *     summary: Get activity log for a ticket
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timeline of ticket activity
 */
activityRouter.get("/:id/activity", listTicketActivityHandler);
//# sourceMappingURL=activity.routes.js.map