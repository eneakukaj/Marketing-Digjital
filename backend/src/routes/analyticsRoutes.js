import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  getAnalyticsController,
  createAnalyticsController,
  updateAnalyticsController,
  deleteAnalyticsController,
  getLeadsController,       
  createLeadController,     
  updateLeadController,     
  deleteLeadController
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAnalyticsController);
router.post("/", authorizeRoles("ADMIN", "MANAGER"), createAnalyticsController);
router.put("/:id", authorizeRoles("ADMIN", "MANAGER"), updateAnalyticsController);
router.delete("/:id", authorizeRoles("ADMIN"), deleteAnalyticsController);
router.get("/leads", getLeadsController);
router.post("/leads", authorizeRoles("ADMIN", "MANAGER"), createLeadController);
router.put("/leads/:id", authorizeRoles("ADMIN", "MANAGER"), updateLeadController);
router.delete("/leads/:id", authorizeRoles("ADMIN"), deleteLeadController);

export default router;