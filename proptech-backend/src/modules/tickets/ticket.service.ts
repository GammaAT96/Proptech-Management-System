import { prisma } from "../../config/prisma.js";
import { createNotification } from "../notifications/notification.service.js";
import type {
  AssignTechnicianInput,
  CreateTicketInput,
  UpdateStatusInput,
} from "./ticket.schema.js";

const ticketSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  tenantId: true,
  technicianId: true,
  propertyId: true,
  createdAt: true,
} as const;

export const createTicket = async (input: CreateTicketInput) => {
  const ticket = await prisma.ticket.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "OPEN",
      tenantId: input.tenantId,
      propertyId: input.propertyId,
      technicianId: input.technicianId ?? null,
    },
    select: ticketSelect,
  });

  await prisma.ticketactivity.create({
    data: {
      ticketId: ticket.id,
      userId: input.tenantId,
      action: "Ticket created",
    },
  });

  // Notify property manager about new ticket
  const property = await prisma.property.findUnique({
    where: { id: input.propertyId },
    select: { managerId: true },
  });

  if (property?.managerId) {
    await createNotification({
      userId: property.managerId,
      message: `New ticket created: ${ticket.title}`,
    });
  }

  return ticket;
};

export const listTickets = async (page = 1, limit = 20) => {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = (Math.max(page, 1) - 1) * take;

  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      select: ticketSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.ticket.count(),
  ]);

  return {
    items,
    page: Math.max(page, 1),
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
  };
};

export const getTicketById = async (id: string) => {
  return prisma.ticket.findUnique({
    where: { id },
    select: ticketSelect,
  });
};

export const assignTechnician = async (
  ticketId: string,
  input: AssignTechnicianInput
) => {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        technicianId: input.technicianId,
        status: "ASSIGNED",
      },
      select: ticketSelect,
    });

    await prisma.ticketactivity.create({
      data: {
        ticketId,
        userId: input.technicianId,
        action: "Technician assigned",
      },
    });

    if (ticket.technicianId) {
      await createNotification({
        userId: ticket.technicianId,
        message: `You have been assigned ticket: ${ticket.title}`,
      });
    }

    return ticket;
  } catch {
    return null;
  }
};

export const updateTicketStatus = async (
  ticketId: string,
  input: UpdateStatusInput
) => {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: input.status },
      select: ticketSelect,
    });

    await prisma.ticketactivity.create({
      data: {
        ticketId,
        userId: input.actorId,
        action: `Status changed to ${input.status}`,
      },
    });

    await createNotification({
      userId: ticket.tenantId,
      message: `Your ticket "${ticket.title}" status changed to ${input.status}`,
    });

    return ticket;
  } catch {
    return null;
  }
};

