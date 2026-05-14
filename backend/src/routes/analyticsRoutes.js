import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  getAnalyticsController,
  createAnalyticsController,
  deleteAnalyticsController
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAnalyticsController);
router.post("/", authorizeRoles("ADMIN", "MANAGER"), createAnalyticsController);
router.delete("/:id", authorizeRoles("ADMIN"), deleteAnalyticsController);

export default router;