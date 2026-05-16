import * as analyticsService from "../services/analytics.service.js";

export const getAnalyticsController = async (req, res) => {
  try {
    const data = await analyticsService.getAllAnalytics();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "An error occurred while fetching analytics data!" });
  }
};



export const createAnalyticsController = async (req, res) => {
  try {
    const entry = await analyticsService.createAnalyticsEntry(req.body);
    res.status(201).json(entry);
  } catch (e) {
    res.status(400).json({ message: "An error occurred while creating the analytics entry!" });
  }
};

export const deleteAnalyticsController = async (req, res) => {
  try {
    await analyticsService.deleteAnalyticsEntry(req.params.id);
    res.json({ message: "Analytics entry deleted successfully!" });
  } catch (e) {
    res.status(500).json({ message: "An error occurred while deleting the analytics entry!" });
  }
};


export const getLeadsController = async (req, res) => {
  try {
    const data = await analyticsService.getAllLeads();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "An error occurred while fetching leads data!" });
  }
};

export const createLeadController = async (req, res) => {
  try {
    const entry = await analyticsService.createLeadEntry(req.body);
    res.status(201).json(entry);
  } catch (e) {
    res.status(400).json({ message: "An error occurred while creating the lead!" });
  }
};

export const updateLeadController = async (req, res) => {
  try {
    const entry = await analyticsService.updateLeadEntry(req.params.id, req.body);
    res.json(entry);
  } catch (e) {
    res.status(400).json({ message: "An error occurred while updating the lead!" });
  }
};

export const deleteLeadController = async (req, res) => {
  try {
    await analyticsService.deleteLeadEntry(req.params.id);
    res.json({ message: "Lead deleted successfully!" });
  } catch (e) {
    res.status(500).json({ message: "An error occurred while deleting the lead!" });
  }
};