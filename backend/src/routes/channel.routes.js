import express from "express";
import {
  getChannelsController,
  getChannelStatsController,
  createChannelController,
  updateChannelController,
  deleteChannelController
} from "../controllers/channel.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

const router = express.Router();


router.get("/", authMiddleware, getChannelsController);
router.get("/stats", authMiddleware, getChannelStatsController);

router.post("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), createChannelController);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), updateChannelController);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), deleteChannelController);

export default router;