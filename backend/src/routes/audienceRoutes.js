import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  getAudiencesController,
  getAudienceByIdController,
  createAudienceController,
  updateAudienceController,
  deleteAudienceController,
} from "../controllers/audience.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAudiencesController);
router.get("/:id", getAudienceByIdController);

router.post("/", authorizeRoles("MANAGER", "ADMIN"), createAudienceController);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateAudienceController);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteAudienceController);

export default router;