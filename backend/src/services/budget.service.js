import db from "../../database/db.js";

export const getAllBudgets = async () => {
  return await db.budgets.findMany();
};

export const createBudget = async (data) => {
  return await db.budgets.create({
    data: {
      campaign_id: Number(data.campaign_id),
      shuma_totale: data.shuma_totale ? Number(data.shuma_totale) : 0,
      shuma_shpenzuar: data.shuma_shpenzuar ? Number(data.shuma_shpenzuar) : 0,
      shuma_mbetur: data.shuma_mbetur ? Number(data.shuma_mbetur) : 0,
    },
  });
};

export const updateBudget = async (id, data) => {
  return await db.budgets.update({
    where: { id: Number(id) },
    data: {
      campaign_id: data.campaign_id ? Number(data.campaign_id) : undefined,
      shuma_totale: data.shuma_totale ? Number(data.shuma_totale) : undefined,
      shuma_shpenzuar: data.shuma_shpenzuar ? Number(data.shuma_shpenzuar) : undefined,
      shuma_mbetur: data.shuma_mbetur ? Number(data.shuma_mbetur) : undefined,
    },
  });
};

export const deleteBudget = async (id) => {
  return await db.budgets.delete({
    where: { id: Number(id) },
  });
};