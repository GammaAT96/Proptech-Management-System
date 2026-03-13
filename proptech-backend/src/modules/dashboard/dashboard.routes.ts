import { Router } from "express";

import { getDashboardStatsHandler } from "./dashboard.controller.js";

export const dashboardRouter = Router();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Aggregated stats for dashboard
 */
dashboardRouter.get("/stats", getDashboardStatsHandler);

