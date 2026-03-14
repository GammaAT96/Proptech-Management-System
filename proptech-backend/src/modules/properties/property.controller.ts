import type { Request, Response } from "express";

import {
  createProperty,
  getProperties,
  getPropertyById,
} from "./property.service.js";
import { createPropertySchema } from "./property.schema.js";
import { getClaimsFromToken, parseAuthHeader } from "../auth/auth.service.js";

export const createPropertyHandler = async (req: Request, res: Response) => {
  const parsed = createPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const property = await createProperty(parsed.data);
  res.status(201).json(property);
};

export const listPropertiesHandler = async (req: Request, res: Response) => {
  const token = parseAuthHeader(req.header("authorization"));
  let managerId: string | undefined;
  if (token) {
    try {
      const claims = getClaimsFromToken(token) as { userId: string; role: string };
      if (claims.role === "MANAGER") {
        managerId = claims.userId;
      }
    } catch {
      // ignore invalid token for now; fall back to global list for non-manager roles
    }
  }

  const properties = await getProperties(managerId);
  res.json(properties);
};

export const getPropertyHandler = async (req: Request, res: Response) => {
  const property = await getPropertyById(req.params.id as string);
  if (!property) {
    return res.status(404).json({ error: "PROPERTY_NOT_FOUND" });
  }
  res.json(property);
};

