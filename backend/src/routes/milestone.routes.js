import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  getMilestonesController,
  createMilestoneController,
  updateMilestoneController,
  deleteMilestoneController,
} from "../controllers/milestone.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMilestonesController);

router.post("/", authorizeRoles("MANAGER", "ADMIN"), createMilestoneController);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateMilestoneController);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteMilestoneController);

export default router;