import type { Request, Response } from "express";
import path from "node:path";

import {
  assignTechnician,
  createTicket,
  getTicketById,
  listTickets,
  updateTicketStatus,
} from "./ticket.service.js";
import {
  assignTechnicianSchema,
  createTicketSchema,
  updateStatusSchema,
} from "./ticket.schema.js";
import { prisma } from "../../config/prisma.js";

export const createTicketHandler = async (req: Request, res: Response) => {
  const parsed = createTicketSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const ticket = await createTicket(parsed.data);
  res.status(201).json(ticket);
};

export const listTicketsHandler = async (req: Request, res: Response) => {
  const page = Number.parseInt(String(req.query.page ?? "1"), 10);
  const limit = Number.parseInt(String(req.query.limit ?? "20"), 10);

  const result = await listTickets(
    Number.isNaN(page) ? 1 : page,
    Number.isNaN(limit) ? 20 : limit
  );

  res.json(result);
};

export const getTicketHandler = async (req: Request, res: Response) => {
  const ticket = await getTicketById(req.params.id as string);
  if (!ticket) {
    return res.status(404).json({ error: "TICKET_NOT_FOUND" });
  }
  res.json(ticket);
};

export const assignTechnicianHandler = async (
  req: Request,
  res: Response
) => {
  const parsed = assignTechnicianSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const updated = await assignTechnician(req.params.id as string, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "TICKET_NOT_FOUND" });
  }

  res.json(updated);
};

export const updateTicketStatusHandler = async (
  req: Request,
  res: Response
) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const updated = await updateTicketStatus(req.params.id as string, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "TICKET_NOT_FOUND" });
  }

  res.json(updated);
};

export const uploadTicketImageHandler = async (req: Request, res: Response) => {
  const ticketId = req.params.id as string;
  if (!req.file) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: "image file is required" });
  }

  const ticket = await getTicketById(ticketId);
  if (!ticket) {
    return res.status(404).json({ error: "TICKET_NOT_FOUND" });
  }

  const relativePath = path.join("uploads", req.file.filename).replace(/\\/g, "/");

  const image = await prisma.ticketimage.create({
    data: {
      ticketId,
      url: `/${relativePath}`,
    },
  });

  res.status(201).json(image);
};

