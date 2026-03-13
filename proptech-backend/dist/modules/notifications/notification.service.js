import { prisma } from "../../config/prisma.js";
export const createNotification = async (input) => {
    return prisma.notification.create({
        data: {
            userId: input.userId,
            message: input.message,
        },
    });
};
export const getNotifications = async (userId) => {
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
export const markNotificationRead = async (id) => {
    try {
        return await prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=notification.service.js.map