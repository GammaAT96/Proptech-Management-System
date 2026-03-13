import { type JwtPayload, type SignOptions } from "jsonwebtoken";
export type JwtUserClaims = {
    userId: string;
    role: string;
};
export declare function signAccessToken(claims: JwtUserClaims, options?: Omit<SignOptions, "expiresIn" | "algorithm">): string;
export declare function verifyAccessToken(token: string): JwtUserClaims & JwtPayload;
//# sourceMappingURL=jwt.d.ts.map