export declare const getActivityForTicket: (ticketId: string) => Promise<{
    id: string;
    createdAt: Date;
    user: {
        name: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
    };
    action: string;
}[]>;
//# sourceMappingURL=activity.service.d.ts.map