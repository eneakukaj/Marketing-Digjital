import {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budget.service.js";
import { createNotification } from "../services/notification.service.js";

export const getBudgetsController = async (req, res) => {
  try {
    const budgets = await getAllBudgets();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBudgetController = async (req, res) => {
  try {
    const budget = await createBudget(req.body);
    await createNotification(req.user.id,`Budget for '${budget.name || 'new item'}' was created successfully.`);
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBudgetController = async (req, res) => {
  try {
    const updated = await updateBudget(req.params.id, req.body);
    await createNotification(req.user.id, `Budget (ID: #${req.params.id}) was updated successfully.`);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBudgetController = async (req, res) => {
  try {
    await deleteBudget(req.params.id);
    await createNotification( req.user.id,`Budget (ID: #${req.params.id}) was deleted successfully.`);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};