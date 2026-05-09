import db from "../../database/db.js";

export const createCampaign = async (data) => {
  return await db.campaigns.create({
    data,
  });
};

export const getAllCampaigns = async () => {
  return await db.campaigns.findMany();
};

export const getCampaignById = async (id) => {
  return await db.campaigns.findUnique({
    where: { id: Number(id) },
  });
};

export const updateCampaign = async (id, data) => {
  return await db.campaigns.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteCampaign = async (id) => {
  return await db.campaigns.delete({
    where: { id: Number(id) },
  });
};