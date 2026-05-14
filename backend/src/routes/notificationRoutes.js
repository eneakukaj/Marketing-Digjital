import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { 
  getNotifications, 
  markAsRead, 
  getStatus,
  toggleNotifications 
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware); 

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.get("/status", getStatus);
router.put("/toggle", toggleNotifications);

export default router;