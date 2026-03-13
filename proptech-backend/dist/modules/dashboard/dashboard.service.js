import { prisma } from "../../config/prisma.js";
export const getDashboardStats = async () => {
    const [openCount, doneCount, ticketsPerProperty, technicianWorkload] = await Promise.all([
        prisma.ticket.count({ where: { status: "OPEN" } }),
        prisma.ticket.count({ where: { status: "DONE" } }),
        prisma.ticket.groupBy({
            by: ["propertyId"],
            _count: { _all: true },
        }),
        prisma.ticket.groupBy({
            by: ["technicianId"],
            where: { technicianId: { not: null } },
            _count: { _all: true },
        }),
    ]);
    return {
        openTickets: openCount,
        completedTickets: doneCount,
        ticketsPerProperty,
        technicianWorkload,
    };
};
//# sourceMappingURL=dashboard.service.js.map