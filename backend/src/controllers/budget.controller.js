import {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budget.service.js";
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
    if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can create budgets.",
      });
    }

    const budget = await createBudget(req.body);

    await createNotification(
      req.user.id,
      `Budget for '${budget.name || "new item"}' was created successfully.`
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Error while creating budget" });
  }
};

export const updateBudgetController = async (req, res) => {
  try {
    if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can update budgets.",
      });
    }

    const updated = await updateBudget(req.params.id, req.body);

    await createNotification(
      req.user.id,
      `Budget (ID: #${req.params.id}) was updated successfully.`
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error while updating budget" });
  }
};

export const deleteBudgetController = async (req, res) => {
  try {
    if (!checkAdminOrManager(req.user)) {
      return res.status(403).json({
        message: "Forbidden: Only Admin or Manager can delete budgets.",
      });
    }

    await deleteBudget(req.params.id);

    await createNotification(
      req.user.id,
      `Budget (ID: #${req.params.id}) was deleted successfully.`
    );

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting budget" });
  }
};