import type { Request, Response } from "express";

import {
  getActivityForTicket,
  getRecentActivity,
  getRecentActivityForTechnician,
  getRecentActivityForTenant,
  getRecentActivityForManager,
} from "./activity.service.js";
import { getClaimsFromToken, parseAuthHeader } from "../auth/auth.service.js";

export const listTicketActivityHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activities = await getActivityForTicket(id as string);
  res.json(activities);
};

export const getRecentActivityHandler = async (req: Request, res: Response) => {
  const limit = Number.parseInt(String(req.query.limit ?? "50"), 10);
  const effectiveLimit = Number.isNaN(limit) ? 50 : limit;

  const token = parseAuthHeader(req.header("authorization"));
  if (token) {
    try {
      const claims = getClaimsFromToken(token) as { userId: string; role: string };
      if (claims.role === "MANAGER") {
        const activities = await getRecentActivityForManager(
          claims.userId,
          effectiveLimit
        );
        return res.json(activities);
      }
    } catch {
      // invalid token: fall through to global activity
    }
  }

  const activities = await getRecentActivity(effectiveLimit);
  res.json(activities);
};

export const getMyActivityHandler = async (req: Request, res: Response) => {
  const token = parseAuthHeader(req.header("authorization"));
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  let claims: { userId: string; role: string };
  try {
    claims = getClaimsFromToken(token) as typeof claims;
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const limit = Number.parseInt(String(req.query.limit ?? "50"), 10);
  const effectiveLimit = Number.isNaN(limit) ? 50 : limit;

  if (claims.role === "TECHNICIAN") {
    const activities = await getRecentActivityForTechnician(
      claims.userId,
      effectiveLimit
    );
    return res.json(activities);
  }

  if (claims.role === "TENANT") {
    const activities = await getRecentActivityForTenant(
      claims.userId,
      effectiveLimit
    );
    return res.json(activities);
  }

  return res.status(403).json({ error: "FORBIDDEN" });
};

