import { prisma } from "../../config/prisma.js";
export const getActivityForTicket = async (ticketId) => {
    return prisma.ticketactivity.findMany({
        where: { ticketId },
        select: {
            id: true,
            action: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
};
//# sourceMappingURL=activity.service.js.map