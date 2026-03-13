import jwt, {} from "jsonwebtoken";
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }
    return secret;
}
function normalizeExpiresIn() {
    const expiresIn = process.env.JWT_EXPIRES_IN?.trim();
    return (expiresIn && expiresIn.length > 0 ? expiresIn : "1d");
}
export function signAccessToken(claims, options) {
    return jwt.sign(claims, getJwtSecret(), {
        ...options,
        algorithm: "HS256",
        expiresIn: normalizeExpiresIn(),
    });
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, getJwtSecret(), {
        algorithms: ["HS256"],
    });
    if (typeof decoded !== "object" || decoded === null) {
        throw new Error("Invalid token payload");
    }
    const payload = decoded;
    if (!payload.userId || !payload.role) {
        throw new Error("Token missing required claims");
    }
    return payload;
}
//# sourceMappingURL=jwt.js.map