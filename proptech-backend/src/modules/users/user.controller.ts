import type { Request, Response } from "express";
import * as userService from "./user.service.js";

export const listUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.getUserById(id as string);

  if (!user) {
    return res.status(404).json({ error: "USER_NOT_FOUND" });
  }

  res.json(user);
};

export const listTechnicians = async (_req: Request, res: Response) => {
  const technicians = await userService.getTechnicians();
  res.json(technicians);
};

