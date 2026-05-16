import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  getBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getBudgetsController);

router.post("/", authorizeRoles("MANAGER", "ADMIN"), createBudgetController);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateBudgetController);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteBudgetController);

export default router;