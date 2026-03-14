import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.js";

export const createUser = async (input: CreateUserInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    return { error: "EMAIL_TAKEN" as const } as const;
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: passwordHash,
      role: input.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return { user } as const;
};

export const updateUser = async (userId: string, input: UpdateUserInput) => {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return null;
  if (input.email && input.email !== existing.email) {
    const taken = await prisma.user.findUnique({ where: { email: input.email } });
    if (taken) return { error: "EMAIL_TAKEN" as const } as const;
  }
  const data: { name?: string; email?: string; password?: string; role?: "TENANT" | "MANAGER" | "TECHNICIAN" | "ADMIN" } = {};
  if (input.name != null) data.name = input.name;
  if (input.email != null) data.email = input.email;
  if (input.role != null) data.role = input.role;
  if (input.password != null) data.password = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return { user } as const;
};

export const deleteUser = async (userId: string) => {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return true;
  } catch {
    return false;
  }
};

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

