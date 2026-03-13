import type { Request, Response } from "express";

import {
  getNotifications,
  markNotificationRead,
} from "./notification.service.js";
import { listNotificationsQuerySchema } from "./notification.schema.js";

export const listNotificationsHandler = async (req: Request, res: Response) => {
  const parsed = listNotificationsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const notifications = await getNotifications(parsed.data.userId);
  res.json(notifications);
};

export const markNotificationReadHandler = async (
  req: Request,
  res: Response
) => {
  const updated = await markNotificationRead(req.params.id as string);
  if (!updated) {
    return res.status(404).json({ error: "NOTIFICATION_NOT_FOUND" });
  }

  res.json(updated);
};

