import * as analyticsService from "../services/analytics.service.js";
import { createNotification } from "../services/notification.service.js";

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
    const entry = await analyticsService.createAnalyticsEntry({ ...req.body, user_id: req.user.id });
    await createNotification(req.user.id, "Analytics entry created successfully.");
    res.status(201).json(entry);
  } catch (e) {
    res.status(400).json({ message: "An error occurred while creating the analytics entry!" });
  }
};

export const updateAnalyticsController = async (req, res) => {
  try {
    const entry = await analyticsService.updateAnalyticsEntry(req.params.id, req.body);
    await createNotification(req.user.id, `Analytics entry #${req.params.id} updated successfully.`);
    res.json(entry);
  } catch (e) {
    res.status(400).json({ message: "An error occurred while updating the analytics entry!" });
  }
};

export const deleteAnalyticsController = async (req, res) => {
  try {
    const entry = await analyticsService.getAnalyticsById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Analytics entry not found!" });

    
    const roles = req.user?.roles || req.user?.role || req.user?.userroles || [];
    const userRoles = Array.isArray(roles) ? roles : [roles];
    const normalizedRoles = userRoles.map(r => 
      typeof r === 'string' ? r.toUpperCase() : (r?.role?.normalized_name || r?.normalized_name || '').toUpperCase()
    );
    
    const isAdmin = normalizedRoles.includes("ADMIN");
    const isManager = normalizedRoles.includes("MANAGER");

   
    if (!isAdmin) {
      if (isManager && Number(entry.user_id) !== Number(req.user.id)) {
        return res.status(403).json({ message: "You are not the owner of this analytics entry." });
      }
      if (!isManager) {
        return res.status(403).json({ message: "You are not authorized to delete this analytics entry." });
      }
    }

    await analyticsService.deleteAnalyticsEntry(req.params.id);
    await createNotification(req.user.id, `Analytics entry #${req.params.id} deleted successfully.`);
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
    const entry = await analyticsService.createLeadEntry({ ...req.body, user_id: req.user.id });
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
    
    const lead = await analyticsService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found!" });

    
    const roles = req.user?.roles || req.user?.role || req.user?.userroles || [];
    const userRoles = Array.isArray(roles) ? roles : [roles];
    const normalizedRoles = userRoles.map(r => 
      typeof r === 'string' ? r.toUpperCase() : (r?.role?.normalized_name || r?.normalized_name || '').toUpperCase()
    );
    
    const isAdmin = normalizedRoles.includes("ADMIN");
    const isManager = normalizedRoles.includes("MANAGER");

    
    if (!isAdmin) {
      if (isManager && Number(lead.user_id) !== Number(req.user.id)) {
        return res.status(403).json({ message: "You are not the owner of this lead." });
      }
      if (!isManager) {
        return res.status(403).json({ message: "You are not authorized to delete this lead." });
      }
    }

    await analyticsService.deleteLeadEntry(req.params.id);
    res.json({ message: "Lead deleted successfully!" });
  } catch (e) {
    res.status(500).json({ message: "An error occurred while deleting the lead!" });
  }
};