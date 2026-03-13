import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export type JwtUserClaims = {
  userId: string;
  role: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}

function normalizeExpiresIn(): Exclude<SignOptions["expiresIn"], undefined> {
  const expiresIn = process.env.JWT_EXPIRES_IN?.trim();
  return (expiresIn && expiresIn.length > 0 ? expiresIn : "1d") as Exclude<
    SignOptions["expiresIn"],
    undefined
  >;
}

export function signAccessToken(
  claims: JwtUserClaims,
  options?: Omit<SignOptions, "expiresIn" | "algorithm">
): string {
  return jwt.sign(claims, getJwtSecret(), {
    ...options,
    algorithm: "HS256",
    expiresIn: normalizeExpiresIn(),
  });
}

export function verifyAccessToken(token: string): JwtUserClaims & JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as JwtPayload & Partial<JwtUserClaims>;
  if (!payload.userId || !payload.role) {
    throw new Error("Token missing required claims");
  }

  return payload as JwtUserClaims & JwtPayload;
}

