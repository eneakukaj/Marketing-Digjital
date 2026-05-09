import express from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import managerRoutes from "./manager.routes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/admin", adminRoutes);
router.use("/manager", managerRoutes);
router.use("/users", userRoutes);

export default router;