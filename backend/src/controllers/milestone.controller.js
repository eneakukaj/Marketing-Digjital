import {
  getAllMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../services/milestone.service.js";
import { createNotification } from "../services/notification.service.js";

export const getMilestonesController = async (req, res) => {
  try {
    const milestones = await getAllMilestones();
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMilestoneController = async (req, res) => {
  try {
    const milestone = await createMilestone(req.body);
    await createNotification(req.user.id,`Milestone '${milestone.title || 'New Milestone'}' created successfully.`);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMilestoneController = async (req, res) => {
  try {
    const updated = await updateMilestone(req.params.id, req.body);
    await createNotification(req.user.id,`Milestone '${updated.title || req.params.id}' updated successfully.`);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMilestoneController = async (req, res) => {
  try {
    await deleteMilestone(req.params.id);
    await createNotification(req.user.id,`Milestone (ID: #${req.params.id}) deleted successfully.`);
    res.json({
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};