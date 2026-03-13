import { prisma } from "../../config/prisma.js";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getTechnicians = async () => {
  return prisma.user.findMany({
    where: { role: "TECHNICIAN" },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

