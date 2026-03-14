import * as userService from "./user.service.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { getClaimsFromToken, parseAuthHeader } from "../auth/auth.service.js";
export const listUsers = async (_req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
};
export const createUser = async (req, res) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }
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
    const creatorRole = claims.role;
    const newUserRole = parsed.data.role;
    if (creatorRole === "TECHNICIAN" || creatorRole === "TENANT") {
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    if (creatorRole === "MANAGER" && newUserRole !== "TENANT" && newUserRole !== "TECHNICIAN") {
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    const result = await userService.createUser(parsed.data);
    if ("error" in result) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result.user);
};
export const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    res.json(user);
};
export const updateUser = async (req, res) => {
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
    const target = await userService.getUserById(req.params.id);
    if (!target) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    if (claims.role === "TECHNICIAN" || claims.role === "TENANT") {
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    if (claims.role === "MANAGER" && (target.role === "ADMIN" || target.role === "MANAGER")) {
        return res.status(403).json({ error: "FORBIDDEN", message: "Managers cannot modify admin or other manager accounts" });
    }
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }
    const result = await userService.updateUser(req.params.id, parsed.data);
    if (!result) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    if ("error" in result) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result.user);
};
export const deleteUser = async (req, res) => {
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
    const target = await userService.getUserById(req.params.id);
    if (!target) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    if (claims.role === "TECHNICIAN" || claims.role === "TENANT") {
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    if (claims.role === "MANAGER" && (target.role === "ADMIN" || target.role === "MANAGER")) {
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    res.status(204).send();
};
export const listTechnicians = async (_req, res) => {
    const technicians = await userService.getTechnicians();
    res.json(technicians);
};
//# sourceMappingURL=user.controller.js.map