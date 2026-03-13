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