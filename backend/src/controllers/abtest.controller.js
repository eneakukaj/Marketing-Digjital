import * as abTestService from "../services/abtest.service.js";

export const getABTests = async (req, res) => {
  try {
    const tests = await abTestService.getAllABTests();
    res.json(tests);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createABTest = async (req, res) => {
  try {
    const test = await abTestService.createABTest(req.body);
    res.status(201).json(test);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateABTest = async (req, res) => {
  try {
    const updated = await abTestService.updateABTest(req.params.id, req.body);
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteABTest = async (req, res) => {
  try {
    await abTestService.deleteABTest(req.params.id);
    res.json({ message: "A/B Test deleted successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};