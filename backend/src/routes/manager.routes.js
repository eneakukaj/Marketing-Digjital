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

router.post(
  "/campaigns",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json("Create campaign");
  }
);

router.put(
  "/campaigns/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json("Update campaign");
  }
);

router.get(
  "/contents",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  getContents
);

router.post(
  "/contents",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  addContent
);

router.put(
  "/contents/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  editContent
);

router.delete(
  "/contents/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  removeContent
);

router.get(
  "/analytics",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json("View analytics");
  }
);

router.post(
  "/budgets",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json("Manage budget");
  }
);

export default router;
