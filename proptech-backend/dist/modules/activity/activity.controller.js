import { getActivityForTicket, getRecentActivity, getRecentActivityForTechnician, getRecentActivityForTenant, getRecentActivityForManager, } from "./activity.service.js";
import { getClaimsFromToken, parseAuthHeader } from "../auth/auth.service.js";
export const listTicketActivityHandler = async (req, res) => {
    const { id } = req.params;
    const activities = await getActivityForTicket(id);
    res.json(activities);
};
export const getRecentActivityHandler = async (req, res) => {
    const limit = Number.parseInt(String(req.query.limit ?? "50"), 10);
    const effectiveLimit = Number.isNaN(limit) ? 50 : limit;
    const token = parseAuthHeader(req.header("authorization"));
    if (token) {
        try {
            const claims = getClaimsFromToken(token);
            if (claims.role === "MANAGER") {
                const activities = await getRecentActivityForManager(claims.userId, effectiveLimit);
                return res.json(activities);
            }
        }
        catch {
            // invalid token: fall through to global activity
        }
    }
    const activities = await getRecentActivity(effectiveLimit);
    res.json(activities);
};
export const getMyActivityHandler = async (req, res) => {
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
    const limit = Number.parseInt(String(req.query.limit ?? "50"), 10);
    const effectiveLimit = Number.isNaN(limit) ? 50 : limit;
    if (claims.role === "TECHNICIAN") {
        const activities = await getRecentActivityForTechnician(claims.userId, effectiveLimit);
        return res.json(activities);
    }
    if (claims.role === "TENANT") {
        const activities = await getRecentActivityForTenant(claims.userId, effectiveLimit);
        return res.json(activities);
    }
    return res.status(403).json({ error: "FORBIDDEN" });
};
//# sourceMappingURL=activity.controller.js.map