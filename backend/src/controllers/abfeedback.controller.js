import * as feedbackService from "../services/abfeedback.service.js";

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.json(feedbacks);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body);
    res.status(201).json(feedback);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateFeedback = async (req, res) => {
  try {
    const updated = await feedbackService.updateFeedback(req.params.id, req.body);
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteFeedback = async (req, res) => {
  try {
    await feedbackService.deleteFeedback(req.params.id);
    res.json({ message: "Feedback note deleted successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};