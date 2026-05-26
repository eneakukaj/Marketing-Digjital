import {
  getAllMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../services/milestone.service.js";
import { createNotification } from "../services/notification.service.js";

const checkAdminOrManager = (user) => {
  const roles = user?.roles || user?.role || user?.userroles || [];
  const userRoles = Array.isArray(roles) ? roles : [roles];

  const normalizedRoles = userRoles.map((r) =>
    typeof r === "string"
      ? r.toUpperCase()
      : (
          r?.role?.normalized_name ||
          r?.role?.name ||
          r?.normalized_name ||
          r?.name ||
          ""
        ).toUpperCase()
  );

  return (
    normalizedRoles.includes("ADMIN") ||
    normalizedRoles.includes("MANAGER")
  );
};

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
   if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can create milestones.",
      });
    }

    const milestone = await createMilestone(req.body);

    await createNotification(
      req.user.id,
      `Milestone '${milestone.title || "New Milestone"}' created successfully.`
    );

    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: "Error while creating milestone" });
  }
};

export const updateMilestoneController = async (req, res) => {
  try {
    if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can update milestones.",
      });
    }

    const updated = await updateMilestone(req.params.id, req.body);

    await createNotification(
      req.user.id,
      `Milestone '${updated.title || req.params.id}' updated successfully.`
    );

    res.status(200).json(updated);
  } catch (error) {
     res.status(500).json({ message: "Error while updating milestone" });
  }
};

export const deleteMilestoneController = async (req, res) => {
  try {
     if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can delete milestones.",
      });
    }

    await deleteMilestone(req.params.id);

    await createNotification(
      req.user.id,
      `Milestone (ID: #${req.params.id}) deleted successfully.`
    );

    res.status(200).json({
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting milestone" });
  }
};