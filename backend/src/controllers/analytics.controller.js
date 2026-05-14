import * as analyticsService from "../services/analytics.service.js";

export const getAnalyticsController = async (req, res) => {
  try {
    const data = await analyticsService.getAllAnalytics();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "Gabim gjatë marrjes së analitikës" });
  }
};

export const createAnalyticsController = async (req, res) => {
  try {
    const entry = await analyticsService.createAnalyticsEntry(req.body);
    res.status(201).json(entry);
  } catch (e) {
    res.status(400).json({ message: "Dështoi krijimi i të dhënave" });
  }
};

export const deleteAnalyticsController = async (req, res) => {
  try {
    await analyticsService.deleteAnalyticsEntry(req.params.id);
    res.json({ message: "Analitika u fshi me sukses" });
  } catch (e) {
    res.status(500).json({ message: "Gabim gjatë fshirjes" });
  }
};