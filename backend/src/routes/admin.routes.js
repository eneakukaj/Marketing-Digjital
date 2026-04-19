import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get("/users", authMiddleware, authorizeRoles("ADMIN"), (req, res) => {
  res.json("Get all users");
});

router.delete("/users/:id", authMiddleware, authorizeRoles("ADMIN"), (req, res) => {
  res.json("Delete user");
});

router.post("/roles", authMiddleware, authorizeRoles("ADMIN"), (req, res) => {
  res.json("Create role");
});

router.delete("/campaigns/:id", authMiddleware, authorizeRoles("ADMIN"), (req, res) => {
  res.json("Delete campaign");
});

router.get("/reports", authMiddleware, authorizeRoles("ADMIN"), (req, res) => {
  res.json("Get all reports");
});

export default router;
