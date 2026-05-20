import * as abTestService from "../services/abtest.service.js";
import { createNotification } from "../services/notification.service.js";

export const getABTests = async (req, res) => {
  try {
    const tests = await abTestService.getAllABTests();
    res.json(tests);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createABTest = async (req, res) => {
  try {
    const test = await abTestService.createABTest(req.body);
    await createNotification(req.user.id, "A/B Test created successfully.");
    res.status(201).json(test);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateABTest = async (req, res) => {
  try {
    const updated = await abTestService.updateABTest(req.params.id, req.body);
    await createNotification(req.user.id, "A/B Test updated successfully.");
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteABTest = async (req, res) => {
  try {
    await abTestService.deleteABTest(req.params.id);
    await createNotification(req.user.id, "A/B Test deleted successfully.");
    res.json({ message: "A/B Test deleted successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const voteABTest = async (req, res) => {
  try {
    const { variant } = req.body;
    const userId = req.user?.id;
    const updated = await abTestService.voteABTest(req.params.id, variant, userId);
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};