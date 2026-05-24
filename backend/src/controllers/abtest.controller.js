import * as abTestService from "../services/abtest.service.js";
import { createNotification } from "../services/notification.service.js";

const checkAuthorization = (user, itemUserId) => {
  const roles = user?.roles || user?.role || user?.userroles || [];
  const userRoles = Array.isArray(roles) ? roles : [roles];
  const normalizedRoles = userRoles.map(r => 
    typeof r === 'string' ? r.toUpperCase() : (r?.role?.normalized_name || r?.normalized_name || '').toUpperCase()
  );
  const isAdminOrManager = normalizedRoles.includes("ADMIN") || normalizedRoles.includes("MANAGER");
  
  return isAdminOrManager || Number(itemUserId) === Number(user?.id);
};

export const getABTests = async (req, res) => {
  try {
    const tests = await abTestService.getAllABTests();
    res.json(tests);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createABTest = async (req, res) => {
  try {
    const test = await abTestService.createABTest({ ...req.body, user_id: req.user.id });
    await createNotification(req.user.id, "A/B Test created successfully.");
    res.status(201).json(test);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateABTest = async (req, res) => {
  try {
    const existingTest = await abTestService.getABTestById(req.params.id);
    if (!existingTest) return res.status(404).json({ message: "A/B Test not found" });

    if (!checkAuthorization(req.user, existingTest.user_id)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to edit this test." });
    }

    const updated = await abTestService.updateABTest(req.params.id, req.body);
    await createNotification(req.user.id, "A/B Test updated successfully.");
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteABTest = async (req, res) => {
  try {
    const existingTest = await abTestService.getABTestById(req.params.id);
    if (!existingTest) return res.status(404).json({ message: "A/B Test not found" });

    if (!checkAuthorization(req.user, existingTest.user_id)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to delete this test." });
    }

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