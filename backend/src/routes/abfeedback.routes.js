import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from "../controllers/abfeedback.controller.js";

const router = express.Router();


router.use(authMiddleware);


router.get("/", getFeedbacks);


router.post("/", authorizeRoles("USER", "MANAGER", "ADMIN"), createFeedback);
router.put("/:id", authorizeRoles("USER", "MANAGER", "ADMIN"), updateFeedback);
router.delete("/:id", authorizeRoles("USER", "MANAGER", "ADMIN"), deleteFeedback);

export default router;