import { Router } from "express";
import { getUser, listTechnicians, listUsers, } from "./user.controller.js";
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
//# sourceMappingURL=user.routes.js.map