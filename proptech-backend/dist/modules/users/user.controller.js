import * as userService from "./user.service.js";
export const listUsers = async (_req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
};
export const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    res.json(user);
};
export const listTechnicians = async (_req, res) => {
    const technicians = await userService.getTechnicians();
    res.json(technicians);
};
//# sourceMappingURL=user.controller.js.map