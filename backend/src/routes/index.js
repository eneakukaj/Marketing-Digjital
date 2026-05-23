import express from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import managerRoutes from "./manager.routes.js";
import userRoutes from "./userRoutes.js";
import settingsRoutes from "./settings.routes.js";
import campaignRoutes from "./campaign.routes.js";
import schedulingRoutes from "./scheduling.routes.js";
import budgetRoutes from "./budget.routes.js";
import milestoneRoutes from "./milestone.routes.js";
import contentRoutes from "./content.routes.js";


const router = express.Router();

router.use("/auth", authRoutes);

router.use("/admin", adminRoutes);
router.use("/manager", managerRoutes);
router.use("/users", userRoutes);
router.use("/settings", settingsRoutes);
router.use("/manager/campaigns", campaignRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/contents", contentRoutes);
router.use("/manager/scheduling", schedulingRoutes);
router.use("/manager/budgets", budgetRoutes);
router.use("/manager/milestones", milestoneRoutes);

export default router;