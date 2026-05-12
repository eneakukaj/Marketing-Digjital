import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../services/scheduling.service.js";

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
    const schedule = await createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateScheduleController = async (req, res) => {
  try {
    const updated = await updateSchedule(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteScheduleController = async (req, res) => {
  try {
    await deleteSchedule(req.params.id);
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};