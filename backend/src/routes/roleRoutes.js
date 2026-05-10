import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import {
  getRolesController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
  getPermissionsController,
} from "../controllers/roleController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("ADMIN"));

router.get("/", getRolesController);
router.post("/", createRoleController);
router.put("/:id", updateRoleController);
router.delete("/:id", deleteRoleController);


router.get("/permissions/list", getPermissionsController);

export default router;