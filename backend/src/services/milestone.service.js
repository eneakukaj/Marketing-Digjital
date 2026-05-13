import db from "../../database/db.js";

export const getAllMilestones = async () => {
  return await db.milestones.findMany();
};

export const createMilestone = async (data) => {
  return await db.milestones.create({
    data: {
      user_id: Number(data.user_id),
      campaign_id: data.campaign_id ? Number(data.campaign_id) : null,
      description: data.description || null,
      due_date: data.due_date ? new Date(data.due_date) : null,
      statusi: data.statusi || "pending",
    },
  });
};

export const updateMilestone = async (id, data) => {
  return await db.milestones.update({
    where: { id: Number(id) },
    data: {
      user_id: data.user_id ? Number(data.user_id) : undefined,
      campaign_id: data.campaign_id ? Number(data.campaign_id) : undefined,
      description: data.description,
      due_date: data.due_date ? new Date(data.due_date) : undefined,
      statusi: data.statusi,
    },
  });
};

export const deleteMilestone = async (id) => {
  return await db.milestones.delete({
    where: { id: Number(id) },
  });
};