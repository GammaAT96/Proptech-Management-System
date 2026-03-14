import path from "node:path";
import { assignTechnician, createTicket, getTicketById, listTickets, listTicketsForTechnician, listTicketsForTenant, listTicketsForManager, updateTicketStatus, } from "./ticket.service.js";
import { assignTechnicianSchema, createTicketSchema, updateStatusSchema, } from "./ticket.schema.js";
import { getClaimsFromToken, parseAuthHeader } from "../auth/auth.service.js";
import { prisma } from "../../config/prisma.js";
export const createTicketHandler = async (req, res) => {
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
export const listTicketsHandler = async (req, res) => {
    const page = Number.parseInt(String(req.query.page ?? "1"), 10);
    const limit = Number.parseInt(String(req.query.limit ?? "20"), 10);
    const safePage = Number.isNaN(page) ? 1 : page;
    const safeLimit = Number.isNaN(limit) ? 20 : limit;
    const token = parseAuthHeader(req.header("authorization"));
    if (token) {
        try {
            const claims = getClaimsFromToken(token);
            if (claims.role === "MANAGER") {
                const result = await listTicketsForManager(claims.userId, safePage, safeLimit);
                return res.json(result);
            }
        }
        catch {
            // invalid token: fall through to global list
        }
    }
    const result = await listTickets(safePage, safeLimit);
    res.json(result);
};
export const listMyTicketsHandler = async (req, res) => {
    const token = parseAuthHeader(req.header("authorization"));
    if (!token) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
    }
    let claims;
    try {
        claims = getClaimsFromToken(token);
    }
    catch {
        return res.status(401).json({ error: "UNAUTHORIZED" });
    }
    let items;
    if (claims.role === "TECHNICIAN") {
        items = await listTicketsForTechnician(claims.userId);
    }
    else if (claims.role === "TENANT") {
        items = await listTicketsForTenant(claims.userId);
    }
    else {
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    res.json(items);
};
export const getTicketHandler = async (req, res) => {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: "TICKET_NOT_FOUND" });
    }
    const token = parseAuthHeader(req.header("authorization"));
    if (token) {
        try {
            const claims = getClaimsFromToken(token);
            if ((claims.role === "TECHNICIAN" && ticket.technicianId !== claims.userId) ||
                (claims.role === "TENANT" && ticket.tenantId !== claims.userId)) {
                return res.status(403).json({ error: "FORBIDDEN" });
            }
        }
        catch {
            // invalid token; allow through, other middleware may handle
        }
    }
    res.json(ticket);
};
export const assignTechnicianHandler = async (req, res) => {
    const token = parseAuthHeader(req.header("authorization"));
    if (token) {
        try {
            const claims = getClaimsFromToken(token);
            if (claims.role === "TECHNICIAN") {
                return res.status(403).json({ error: "FORBIDDEN" });
            }
        }
        catch {
            // invalid token
        }
    }
    const parsed = assignTechnicianSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "VALIDATION_ERROR",
            details: parsed.error.flatten(),
        });
    }
    const updated = await assignTechnician(req.params.id, parsed.data);
    if (!updated) {
        return res.status(404).json({ error: "TICKET_NOT_FOUND" });
    }
    res.json(updated);
};
const TECHNICIAN_ALLOWED_STATUS_TRANSITIONS = {
    ASSIGNED: ["IN_PROGRESS"],
    IN_PROGRESS: ["DONE"],
    DONE: [],
    OPEN: [],
};
export const updateTicketStatusHandler = async (req, res) => {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "VALIDATION_ERROR",
            details: parsed.error.flatten(),
        });
    }
    const ticketId = req.params.id;
    const token = parseAuthHeader(req.header("authorization"));
    let payload = { ...parsed.data };
    if (token) {
        try {
            const claims = getClaimsFromToken(token);
            if (!payload.actorId)
                payload.actorId = claims.userId;
            if (claims.role === "TECHNICIAN") {
                const ticket = await getTicketById(ticketId);
                if (!ticket) {
                    return res.status(404).json({ error: "TICKET_NOT_FOUND" });
                }
                if (ticket.technicianId !== claims.userId) {
                    return res.status(403).json({ error: "FORBIDDEN" });
                }
                const allowed = TECHNICIAN_ALLOWED_STATUS_TRANSITIONS[ticket.status];
                if (!allowed?.includes(parsed.data.status)) {
                    return res.status(403).json({
                        error: "FORBIDDEN",
                        message: "Technicians may only transition ASSIGNED→IN_PROGRESS→DONE",
                    });
                }
            }
        }
        catch {
            // invalid token
        }
    }
    if (!payload.actorId) {
        return res.status(400).json({ error: "VALIDATION_ERROR", details: "actorId is required when not authenticated" });
    }
    const updated = await updateTicketStatus(ticketId, payload);
    if (!updated) {
        return res.status(404).json({ error: "TICKET_NOT_FOUND" });
    }
    res.json(updated);
};
export const uploadTicketImageHandler = async (req, res) => {
    const ticketId = req.params.id;
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
//# sourceMappingURL=ticket.controller.js.map