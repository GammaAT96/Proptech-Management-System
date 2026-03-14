import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { authRouter } from "./modules/auth/auth.routes.js";
import { userRouter } from "./modules/users/user.routes.js";
import { propertyRouter } from "./modules/properties/property.routes.js";
import { ticketRouter } from "./modules/tickets/ticket.routes.js";
import { activityRouter } from "./modules/activity/activity.routes.js";
import { activityGlobalRouter } from "./modules/activity/activity.global.routes.js";
import { notificationRouter } from "./modules/notifications/notification.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("PropTech Maintenance API Running");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/properties", propertyRouter);
app.use("/tickets", ticketRouter);
app.use("/tickets", activityRouter);
app.use("/activity", activityGlobalRouter);
app.use("/notifications", notificationRouter);
app.use("/dashboard", dashboardRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});