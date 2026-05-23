import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  getContents,
  addContent,
  editContent,
  removeContent,
} from "../controllers/content.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("USER", "MANAGER", "ADMIN"), getContents);
router.post("/", authorizeRoles("USER", "MANAGER", "ADMIN"), addContent);
router.put("/:id", authorizeRoles("USER", "MANAGER", "ADMIN"), editContent);
router.delete("/:id", authorizeRoles("USER", "MANAGER", "ADMIN"), removeContent);

export default router;