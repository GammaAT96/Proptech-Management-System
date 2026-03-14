import { prisma } from "../../config/prisma.js";
import type { CreatePropertyInput } from "./property.schema.js";

export const createProperty = async (input: CreatePropertyInput) => {
  return prisma.property.create({
    data: {
      name: input.name,
      address: input.address,
      units: input.units,
      managerId: input.managerId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      units: true,
      createdAt: true,
      managerId: true,
    },
  });
};

export const getProperties = async (managerId?: string) => {
  return prisma.property.findMany({
    ...(managerId ? { where: { managerId } } : {}),
    select: {
      id: true,
      name: true,
      address: true,
      units: true,
      createdAt: true,
      managerId: true,
    },
    orderBy: { name: "asc" },
  });
};

export const getPropertyById = async (id: string) => {
  return prisma.property.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      units: true,
      createdAt: true,
      managerId: true,
    },
  });
};

