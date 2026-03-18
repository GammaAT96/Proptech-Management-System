import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

import { prisma } from "../../config/prisma.js";
import { signAccessToken, verifyAccessToken } from "../../utils/jwt.js";
import type { JwtUserClaims } from "../../utils/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    return { error: "EMAIL_TAKEN" as const } as const;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      password: passwordHash,
      role: input.role,
    },
  });

  const token = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  } as const;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    return { error: "INVALID_CREDENTIALS" as const } as const;
  }

  if (!user.password) {
    return { error: "INVALID_CREDENTIALS" as const } as const;
  }
  let ok = false;
  try {
    ok = await bcrypt.compare(input.password, user.password);
  } catch {
    // Treat invalid/legacy password formats as invalid credentials instead of 500.
    return { error: "INVALID_CREDENTIALS" as const } as const;
  }
  if (!ok) {
    return { error: "INVALID_CREDENTIALS" as const } as const;
  }

  const token = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  } as const;
}

export function parseAuthHeader(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export function getClaimsFromToken(token: string): JwtUserClaims {
  const payload = verifyAccessToken(token);
  return {
    userId: payload.userId,
    role: payload.role,
  };
}

