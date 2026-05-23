import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import campaignRoutes from "./campaign.routes.js";

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json("View analytics");
  }
);

export default router;