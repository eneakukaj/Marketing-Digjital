import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
  getProfileController,
  updateProfileController,
  changePasswordController,
  getLoginHistoryController,
} from "../controllers/settings.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", getProfileController);
router.put("/profile", updateProfileController);
router.put("/change-password", changePasswordController);
router.get("/login-history", getLoginHistoryController);

router.put(
  "/system",
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "System settings updated successfully (admin only)",
    });
  }
);

export default router;