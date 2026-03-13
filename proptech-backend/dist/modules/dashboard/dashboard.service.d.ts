export declare const getDashboardStats: () => Promise<{
    openTickets: number;
    completedTickets: number;
    ticketsPerProperty: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.TicketGroupByOutputType, "propertyId"[]> & {
        _count: {
            _all: number;
        };
    })[];
    technicianWorkload: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.TicketGroupByOutputType, "technicianId"[]> & {
        _count: {
            _all: number;
        };
    })[];
}>;
//# sourceMappingURL=dashboard.service.d.ts.map