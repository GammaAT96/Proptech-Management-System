import type { JwtUserClaims } from "../../utils/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
export declare function registerUser(input: RegisterInput): Promise<{
    readonly error: "EMAIL_TAKEN";
    readonly user?: never;
    readonly token?: never;
} | {
    readonly user: {
        readonly id: string;
        readonly name: string;
        readonly email: string;
        readonly role: import("@prisma/client").$Enums.user_role;
        readonly createdAt: Date;
    };
    readonly token: string;
    readonly error?: never;
}>;
export declare function loginUser(input: LoginInput): Promise<{
    readonly error: "INVALID_CREDENTIALS";
    readonly user?: never;
    readonly token?: never;
} | {
    readonly user: {
        readonly id: string;
        readonly name: string;
        readonly email: string;
        readonly role: import("@prisma/client").$Enums.user_role;
        readonly createdAt: Date;
    };
    readonly token: string;
    readonly error?: never;
}>;
export declare function parseAuthHeader(header: string | undefined): string | null;
export declare function getClaimsFromToken(token: string): JwtUserClaims;
//# sourceMappingURL=auth.service.d.ts.map