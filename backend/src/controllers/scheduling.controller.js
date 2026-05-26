import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../services/scheduling.service.js";
import { createNotification } from "../services/notification.service.js";

const checkAdminOrManager = (user) => {
  const roles = user?.roles || user?.role || user?.userroles || [];
  const userRoles = Array.isArray(roles) ? roles : [roles];

  const normalizedRoles = userRoles.map((r) =>
    typeof r === "string"
      ? r.toUpperCase()
      : (r?.role?.normalized_name || r?.normalized_name || "").toUpperCase()
  );

  return (
    normalizedRoles.includes("ADMIN") ||
    normalizedRoles.includes("MANAGER")
  );
};

export const getSchedulesController = async (req, res) => {
  try {
    const schedules = await getAllSchedules();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createScheduleController = async (req, res) => {
  try {
    if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can create schedules.",
      });
    }

    const schedule = await createSchedule(req.body);

    await createNotification(
      req.user.id,
      `Schedule for '${schedule.title || "new content"}' created successfully.`
    );

    res.status(201).json(schedule);
  } catch (error) {
   res.status(500).json({ message: "Error while creating schedule" });
  }
};

export const updateScheduleController = async (req, res) => {
  try {
     if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can update schedules.",
      });
    }

    const updated = await updateSchedule(req.params.id, req.body);

    await createNotification(
      req.user.id,
      `Schedule (ID: #${req.params.id}) updated successfully.`
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error while updating schedule" });
  }
};

export const deleteScheduleController = async (req, res) => {
  try {
    if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can delete schedules.",
      });
    }

    await deleteSchedule(req.params.id);

    await createNotification(
      req.user.id,
      `Schedule (ID: #${req.params.id}) deleted successfully.`
    );

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting schedule" });
  }
};