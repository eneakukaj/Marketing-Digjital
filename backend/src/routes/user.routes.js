import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  authorizeRoles,
  authorizeSelfOrAdmin,
} from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get(
  "/users/:id",
  authMiddleware,
  authorizeSelfOrAdmin(),
  (req, res) => {
    res.json("Get own profile");
  }
);

router.post(
  "/social-media",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  (req, res) => {
    res.json("Add social media account");
  }
);

router.get(
  "/notifications",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  (req, res) => {
    res.json("Get notifications");
  }
);

router.post(
  "/feedback",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  (req, res) => {
    res.json("Leave feedback");
  }
);

export default router;
