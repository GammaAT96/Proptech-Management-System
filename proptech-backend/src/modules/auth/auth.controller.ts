import type { Request, Response, NextFunction } from "express";

import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "./auth.schema.js";
import {
  getClaimsFromToken,
  loginUser,
  parseAuthHeader,
  registerUser,
} from "./auth.service.js";

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const input: RegisterInput = parsed.data;
    const result = await registerUser(input);

    if ("error" in result && result.error === "EMAIL_TAKEN") {
      return res.status(409).json({ error: "EMAIL_TAKEN" });
    }

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const input: LoginInput = parsed.data;
    const result = await loginUser(input);

    if ("error" in result && result.error === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export function meHandler(req: Request, res: Response) {
  const token = parseAuthHeader(req.header("authorization"));
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  try {
    const claims = getClaimsFromToken(token);
    return res.json({ user: claims });
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

