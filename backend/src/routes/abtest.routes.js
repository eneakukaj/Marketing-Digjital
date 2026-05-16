import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  getABTests,
  createABTest,
  updateABTest,
  deleteABTest
} from "../controllers/abtest.controller.js";

const router = express.Router();


router.use(authMiddleware);


router.get("/", getABTests);


router.post("/", authorizeRoles("MANAGER", "ADMIN"), createABTest);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateABTest);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteABTest);

export default router;