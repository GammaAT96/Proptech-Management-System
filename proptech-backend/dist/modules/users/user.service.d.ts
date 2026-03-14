import type { CreateUserInput, UpdateUserInput } from "./user.schema.js";
export declare const createUser: (input: CreateUserInput) => Promise<{
    readonly error: "EMAIL_TAKEN";
    readonly user?: never;
} | {
    readonly user: {
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
        createdAt: Date;
    };
    readonly error?: never;
}>;
export declare const updateUser: (userId: string, input: UpdateUserInput) => Promise<{
    readonly error: "EMAIL_TAKEN";
    readonly user?: never;
} | {
    readonly user: {
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
        createdAt: Date;
    };
    readonly error?: never;
} | null>;
export declare const deleteUser: (userId: string) => Promise<boolean>;
export declare const getAllUsers: () => Promise<{
    name: string;
    email: string;
    role: import("@prisma/client").$Enums.user_role;
    id: string;
    createdAt: Date;
}[]>;
export declare const getUserById: (userId: string) => Promise<{
    name: string;
    email: string;
    role: import("@prisma/client").$Enums.user_role;
    id: string;
    createdAt: Date;
} | null>;
export declare const getTechnicians: () => Promise<{
    name: string;
    email: string;
    id: string;
}[]>;
//# sourceMappingURL=user.service.d.ts.map