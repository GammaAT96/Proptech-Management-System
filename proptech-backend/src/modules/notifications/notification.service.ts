import { prisma } from "../../config/prisma.js";

type CreateNotificationInput = {
  userId: string;
  message: string;
};

export const createNotification = async (input: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      message: input.message,
    },
  });
};

export const getNotifications = async (userId?: string) => {
  if (userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const markNotificationRead = async (id: string) => {
  try {
    return await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  } catch {
    return null;
  }
};

