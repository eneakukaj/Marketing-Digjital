import db from "../../database/db.js";

export const getAllSchedules = async () => {
  return await db.scheduling.findMany();
};

export const createSchedule = async (data) => {
  return await db.scheduling.create({
    data: {
      campaign_id: Number(data.campaign_id),
      content_id: data.content_id ? Number(data.content_id) : null,
      scheduled_time: data.scheduled_time,
      statusi: data.statusi,
    },
  });
};

export const updateSchedule = async (id, data) => {
  return await db.scheduling.update({
    where: { id: Number(id) },
    data: {
      campaign_id: data.campaign_id ? Number(data.campaign_id) : undefined,
      content_id: data.content_id ? Number(data.content_id) : null,
      scheduled_time: data.scheduled_time,
      statusi: data.statusi,
    },
  });
};

export const deleteSchedule = async (id) => {
  return await db.scheduling.delete({
    where: { id: Number(id) },
  });
};