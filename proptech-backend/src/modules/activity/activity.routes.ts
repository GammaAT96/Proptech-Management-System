import { Router } from "express";

import { listTicketActivityHandler } from "./activity.controller.js";

export const activityRouter = Router();

/**
 * @swagger
 * /tickets/{id}/activity:
 *   get:
 *     summary: Get activity log for a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Timeline of ticket activity
 *       404:
 *         description: Ticket not found
 */
activityRouter.get("/:id/activity", listTicketActivityHandler);

