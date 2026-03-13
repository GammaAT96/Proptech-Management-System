import { getDashboardStats } from "./dashboard.service.js";
export const getDashboardStatsHandler = async (_req, res) => {
    const stats = await getDashboardStats();
    res.json(stats);
};
//# sourceMappingURL=dashboard.controller.js.map