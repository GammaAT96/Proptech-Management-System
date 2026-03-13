import { prisma } from "../../config/prisma.js";

export const getActivityForTicket = async (ticketId: string) => {
  return prisma.ticketactivity.findMany({
    where: { ticketId },
    select: {
      id: true,
      action: true,
      createdAt: true,
      ticketId: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

