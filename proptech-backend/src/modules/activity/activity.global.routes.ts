import { Router } from "express";

import { getRecentActivityHandler, getMyActivityHandler } from "./activity.controller.js";

export const activityGlobalRouter = Router();

/**
 * @swagger
 * /activity/my:
 *   get:
 *     summary: Get recent activity for tickets assigned to the current technician
 *     tags: [Activity]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *     responses:
 *       200:
 *         description: Recent activity for technician's assigned tickets
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a technician)
 */
activityGlobalRouter.get("/my", getMyActivityHandler);

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Get recent activity across all tickets
 *     tags: [Activity]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *     responses:
 *       200:
 *         description: Recent activity entries
 */
activityGlobalRouter.get("/", getRecentActivityHandler);
