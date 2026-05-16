import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getOverview } from "../controllers/dashboard.controller.js";

const router = express.Router();
router.get("/overview", authMiddleware, getOverview);

export default router;