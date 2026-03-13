import type { Request, Response } from "express";

import { getDashboardStats } from "./dashboard.service.js";

export const getDashboardStatsHandler = async (_req: Request, res: Response) => {
  const stats = await getDashboardStats();
  res.json(stats);
};

