import { Router } from "express";
import { assignTechnicianHandler, createTicketHandler, getTicketHandler, listTicketsHandler, updateTicketStatusHandler, uploadTicketImageHandler, } from "./ticket.controller.js";
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
 *     summary: List tickets with pagination
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
 *         description: Paginated list of tickets
 */
ticketRouter.get("/", listTicketsHandler);
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *     responses:
 *       201:
 *         description: Image uploaded
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
ticketRouter.post("/:id/images", upload.single("image"), uploadTicketImageHandler);
//# sourceMappingURL=ticket.routes.js.map