export declare const getActivityForTicket: (ticketId: string) => Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    user: {
        name: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
    };
    action: string;
    ticketId: string;
}[]>;
export declare const getRecentActivity: (limit?: number) => Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    user: {
        name: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
    };
    ticket: {
        id: string;
        property: {
            name: string;
        };
        title: string;
        propertyId: string;
    };
    action: string;
    ticketId: string;
}[]>;
export declare const getRecentActivityForTechnician: (technicianId: string, limit?: number) => Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    user: {
        name: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
    };
    ticket: {
        id: string;
        property: {
            name: string;
        };
        title: string;
        propertyId: string;
    };
    action: string;
    ticketId: string;
}[]>;
export declare const getRecentActivityForTenant: (tenantId: string, limit?: number) => Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    user: {
        name: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
    };
    ticket: {
        id: string;
        property: {
            name: string;
        };
        title: string;
        propertyId: string;
    };
    action: string;
    ticketId: string;
}[]>;
export declare const getRecentActivityForManager: (managerId: string, limit?: number) => Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    user: {
        name: string;
        role: import("@prisma/client").$Enums.user_role;
        id: string;
    };
    ticket: {
        id: string;
        property: {
            name: string;
        };
        title: string;
        propertyId: string;
    };
    action: string;
    ticketId: string;
}[]>;
//# sourceMappingURL=activity.service.d.ts.map