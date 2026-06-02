import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {getAllGendersController, createGenderController, updateGenderController, deleteGenderController } from "../controllers/gender.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllGendersController);

router.post("/", authorizeRoles("MANAGER", "ADMIN"), createGenderController);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateGenderController);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteGenderController);

export default router;