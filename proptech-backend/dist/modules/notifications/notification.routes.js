import { Router } from "express";
import { listNotificationsHandler, markNotificationReadHandler, } from "./notification.controller.js";
export const notificationRouter = Router();
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List notifications
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: List of notifications
 */
notificationRouter.get("/", listNotificationsHandler);
/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification updated
 *       404:
 *         description: Notification not found
 */
notificationRouter.patch("/:id/read", markNotificationReadHandler);
//# sourceMappingURL=notification.routes.js.map