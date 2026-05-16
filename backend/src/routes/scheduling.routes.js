import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  getSchedulesController,
  createScheduleController,
  updateScheduleController,
  deleteScheduleController,
} from "../controllers/scheduling.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSchedulesController);

router.post("/", authorizeRoles("MANAGER", "ADMIN"), createScheduleController);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateScheduleController);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteScheduleController);

export default router;