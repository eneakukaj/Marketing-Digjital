import express from "express";
import {
  getTokens,
  revokeToken,
  deleteToken,
} from "../controllers/tokens.controller.js";

const router = express.Router();

router.get("/", getTokens);
router.put("/revoke/:id", revokeToken);
router.delete("/:id", deleteToken);

export default router;