import { getActivityForTicket } from "./activity.service.js";
export const listTicketActivityHandler = async (req, res) => {
    const { id } = req.params;
    const activities = await getActivityForTicket(id);
    res.json(activities);
};
//# sourceMappingURL=activity.controller.js.map