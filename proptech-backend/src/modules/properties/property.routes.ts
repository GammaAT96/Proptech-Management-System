import { Router } from "express";

import {
  createPropertyHandler,
  getPropertyHandler,
  listPropertiesHandler,
} from "./property.controller.js";

export const propertyRouter = Router();

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - managerId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sunset Apartments
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               managerId:
 *                 type: string
 *                 description: ID of the managing user
 *                 example: "user-uuid"
 *     responses:
 *       201:
 *         description: Property created
 *       400:
 *         description: Validation error
 */
propertyRouter.post("/", createPropertyHandler);

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: List all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of properties
 */
propertyRouter.get("/", listPropertiesHandler);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get a property by id
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The property
 *       404:
 *         description: Property not found
 */
propertyRouter.get("/:id", getPropertyHandler);

