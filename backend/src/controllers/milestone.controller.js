import {
  getAllMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../services/milestone.service.js";

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
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMilestoneController = async (req, res) => {
  try {
    const updated = await updateMilestone(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMilestoneController = async (req, res) => {
  try {
    await deleteMilestone(req.params.id);
    res.json({
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};