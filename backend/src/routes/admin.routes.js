import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { deleteCampaignController } from "../controllers/campaign.controller.js";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  changeUserRoleController
} from "../controllers/userController.js";

import {
  getRolesController,
  createRoleController,
  updateRoleController,
  deleteRoleController
} from "../controllers/roleController.js";

import {
  getTokensController,
  revokeTokenController,
  deleteTokenController,
} from "../controllers/tokensController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(authorizeRoles("ADMIN"));

router.get("/roles", getRolesController);
router.post("/roles", createRoleController);
router.put("/roles/:id", updateRoleController);
router.delete("/roles/:id", deleteRoleController);

router.get("/users", getUsersController);
router.get("/users/:id", getUserByIdController);
router.post("/users", createUserController);
router.put("/users/:id", updateUserController);
router.delete("/users/:id", deleteUserController);

router.post("/users/assign-role", changeUserRoleController);

router.get("/tokens", getTokensController);
router.put("/tokens/revoke/:id", revokeTokenController);
router.delete("/tokens/:id", deleteTokenController);

router.delete("/campaigns/:id", deleteCampaignController);

export default router;
