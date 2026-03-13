import { prisma } from "../../config/prisma.js";
export const createProperty = async (input) => {
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
export const getProperties = async () => {
    return prisma.property.findMany({
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
export const getPropertyById = async (id) => {
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
//# sourceMappingURL=property.service.js.map