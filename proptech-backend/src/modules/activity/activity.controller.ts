import type { Request, Response } from "express";

import { getActivityForTicket } from "./activity.service.js";

export const listTicketActivityHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activities = await getActivityForTicket(id as string);
  res.json(activities);
};

