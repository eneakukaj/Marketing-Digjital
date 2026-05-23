import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  createCampaignController,
  getAllCampaignsController,
  getCampaignByIdController,
  updateCampaignController,
  deleteCampaignController,
} from "../controllers/campaign.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllCampaignsController);
router.get("/:id", getCampaignByIdController);

router.post("/", authorizeRoles("USER", "MANAGER", "ADMIN"), createCampaignController);
router.put("/:id", authorizeRoles("USER", "MANAGER", "ADMIN"), updateCampaignController);
router.delete("/:id", authorizeRoles("USER", "MANAGER", "ADMIN"), deleteCampaignController);

export default router;