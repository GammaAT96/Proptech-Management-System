import { Router } from "express";

import {
  assignTechnicianHandler,
  createTicketHandler,
  getTicketHandler,
  listTicketsHandler,
  listMyTicketsHandler,
  updateTicketStatusHandler,
  uploadTicketImageHandler,
} from "./ticket.controller.js";
import { upload } from "../../config/upload.js";

export const ticketRouter = Router();

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - tenantId
 *               - propertyId
 *             properties:
 *               title:
 *                 type: string
 *                 example: AC not working
 *               description:
 *                 type: string
 *                 example: Air conditioner not cooling
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *               tenantId:
 *                 type: string
 *                 description: ID of the tenant user
 *                 example: "tenant-uuid"
 *               propertyId:
 *                 type: string
 *                 example: "31d95ce3-5ec6-4deb-92ad-27b47aae9987"
 *     responses:
 *       201:
 *         description: Ticket created
 *       400:
 *         description: Validation error
 */
ticketRouter.post("/", createTicketHandler);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: List tickets with pagination (role-aware)
 *     description: |
 *       **Role-aware endpoint.** Response set depends on the authenticated user's role:
 *       - **MANAGER** – Returns only tickets for properties where `property.managerId` equals the current user's id. Managers cannot see tickets of another manager's properties.
 *       - **ADMIN** (or other authenticated roles) – Returns all tickets (paginated).
 *       Technicians and tenants should use **GET /tickets/my** for their assigned or own tickets.
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *     responses:
 *       200:
 *         description: Paginated list of tickets (scoped by role)
 *       401:
 *         description: Unauthorized
 */
ticketRouter.get("/", listTicketsHandler);

/**
 * @swagger
 * /tickets/my:
 *   get:
 *     summary: List tickets assigned to the current technician
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: List of tickets assigned to the logged-in technician
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a technician)
 */
ticketRouter.get("/my", listMyTicketsHandler);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The ticket
 *       404:
 *         description: Ticket not found
 */
ticketRouter.get("/:id", getTicketHandler);

/**
 * @swagger
 * /tickets/{id}/assign:
 *   post:
 *     summary: Assign a technician to a ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *             properties:
 *               technicianId:
 *                 type: string
 *                 example: technician-user-uuid
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
ticketRouter.post("/:id/assign", assignTechnicianHandler);

/**
 * @swagger
 * /tickets/{id}/status:
 *   patch:
 *     summary: Update the status of a ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - actorId
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, ASSIGNED, IN_PROGRESS, DONE]
 *                 example: IN_PROGRESS
 *               actorId:
 *                 type: string
 *                 description: User id performing the status change
 *                 example: "technician-user-uuid"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
ticketRouter.patch("/:id/status", updateTicketStatusHandler);

/**
 * @swagger
 * /tickets/{id}/images:
 *   post:
 *     summary: Upload an image for a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
ticketRouter.post("/:id/images", upload.single("image"), uploadTicketImageHandler);

