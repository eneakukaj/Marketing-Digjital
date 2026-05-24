import * as feedbackService from "../services/abfeedback.service.js";
import { createNotification } from "../services/notification.service.js";

const checkAuthorization = (user, itemUserId) => {
  const roles = user?.roles || user?.role || user?.userroles || [];
  const userRoles = Array.isArray(roles) ? roles : [roles];
  const normalizedRoles = userRoles.map(r => 
    typeof r === 'string' ? r.toUpperCase() : (r?.role?.normalized_name || r?.normalized_name || '').toUpperCase()
  );
  const isAdminOrManager = normalizedRoles.includes("ADMIN") || normalizedRoles.includes("MANAGER");
  
  return isAdminOrManager || Number(itemUserId) === Number(user?.id);
};

export const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body, req.user.id);
    res.status(201).json(feedback);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateFeedback = async (req, res) => {
  try {
    const existing = await feedbackService.getFeedbackById(req.params.id);
    if (!checkAuthorization(req.user, existing.user_id)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const updated = await feedbackService.updateFeedback(req.params.id, req.body);
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteFeedback = async (req, res) => {
  try {
    const existing = await feedbackService.getFeedbackById(req.params.id);
    if (!checkAuthorization(req.user, existing.user_id)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    await feedbackService.deleteFeedback(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.json(feedbacks);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};