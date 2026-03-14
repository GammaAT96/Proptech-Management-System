import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUser,
  listTechnicians,
  listUsers,
  updateUser,
} from "./user.controller.js";

export const userRouter = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get("/", listUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string, minLength: 8 }
 *               role: { type: string, enum: [TENANT, MANAGER, TECHNICIAN, ADMIN] }
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error or email taken
 */
userRouter.post("/", createUser);

/**
 * @swagger
 * /users/technicians:
 *   get:
 *     summary: List all technicians
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of technician users
 */
userRouter.get("/technicians", listTechnicians);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user
 *       404:
 *         description: User not found
 */
userRouter.get("/:id", getUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string, minLength: 8 }
 *               role: { type: string, enum: [TENANT, MANAGER, TECHNICIAN, ADMIN] }
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error or email taken
 *       404:
 *         description: User not found
 */
userRouter.patch("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
userRouter.delete("/:id", deleteUser);

