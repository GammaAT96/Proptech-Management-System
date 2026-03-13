import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { prisma } from "../../config/prisma.js";
import { signAccessToken, verifyAccessToken } from "../../utils/jwt.js";
export async function registerUser(input) {
    const existing = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existing) {
        return { error: "EMAIL_TAKEN" };
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
    };
}
export async function loginUser(input) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (!user) {
        return { error: "INVALID_CREDENTIALS" };
    }
    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
        return { error: "INVALID_CREDENTIALS" };
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
    };
}
export function parseAuthHeader(header) {
    if (!header)
        return null;
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token)
        return null;
    return token;
}
export function getClaimsFromToken(token) {
    const payload = verifyAccessToken(token);
    return {
        userId: payload.userId,
        role: payload.role,
    };
}
//# sourceMappingURL=auth.service.js.map