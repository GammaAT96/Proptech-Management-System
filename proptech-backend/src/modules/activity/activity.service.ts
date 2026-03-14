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

const activitySelect = {
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
  ticket: {
    select: {
      id: true,
      title: true,
      propertyId: true,
      property: { select: { name: true } },
    },
  },
} as const;

export const getRecentActivity = async (limit = 50) => {
  const take = Math.min(Math.max(limit, 1), 100);
  return prisma.ticketactivity.findMany({
    select: activitySelect,
    orderBy: { createdAt: "desc" },
    take,
  });
};

export const getRecentActivityForTechnician = async (
  technicianId: string,
  limit = 50
) => {
  const take = Math.min(Math.max(limit, 1), 100);
  return prisma.ticketactivity.findMany({
    where: {
      ticket: {
        technicianId,
      },
    },
    select: activitySelect,
    orderBy: { createdAt: "desc" },
    take,
  });
};

export const getRecentActivityForTenant = async (
  tenantId: string,
  limit = 50
) => {
  const take = Math.min(Math.max(limit, 1), 100);
  return prisma.ticketactivity.findMany({
    where: {
      ticket: {
        tenantId,
      },
    },
    select: activitySelect,
    orderBy: { createdAt: "desc" },
    take,
  });
};

export const getRecentActivityForManager = async (
  managerId: string,
  limit = 50
) => {
  const take = Math.min(Math.max(limit, 1), 100);
  return prisma.ticketactivity.findMany({
    where: {
      ticket: {
        property: {
          managerId,
        },
      },
    },
    select: activitySelect,
    orderBy: { createdAt: "desc" },
    take,
  });
};

