import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  getContents,
  addContent,
  editContent,
  removeContent,
} from "../controllers/content.controller.js";

import {
  createCampaignController,
  getAllCampaignsController,
  getCampaignByIdController,
  updateCampaignController,
} from "../controllers/campaign.controller.js";

import {
  getSchedulesController,
  createScheduleController,
  updateScheduleController,
  deleteScheduleController,
} from "../controllers/scheduling.controller.js";
const router = express.Router();

import {
  getBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
} from "../controllers/budget.controller.js";

router.get(
  "/campaigns",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  getAllCampaignsController
);

router.get(
  "/campaigns/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  getCampaignByIdController
);

router.post(
  "/campaigns",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  createCampaignController
);

router.put(
  "/campaigns/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  updateCampaignController
);


router.get(
  "/contents",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  getContents
);

router.post(
  "/contents",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  addContent
);

router.put(
  "/contents/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  editContent
);

router.delete(
  "/contents/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  removeContent
);


router.get(
  "/analytics",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json("View analytics");
  }
);

router.get(
  "/budgets",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  getBudgetsController
);

router.post(
  "/budgets",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  createBudgetController
);

router.put(
  "/budgets/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  updateBudgetController
);

router.delete(
  "/budgets/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  deleteBudgetController
);

router.get(
  "/scheduling",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  getSchedulesController
);

router.post(
  "/scheduling",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  createScheduleController
);

router.put(
  "/scheduling/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  updateScheduleController
);

router.delete(
  "/scheduling/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  deleteScheduleController
);

export default router;