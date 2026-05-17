import db from "../../database/db.js";

export const createABTest = async (data) => {
  let parsedMetrics = null;
  if (data.metrics && data.metrics.trim() !== "") {
    try {
      parsedMetrics = JSON.parse(data.metrics);
    } catch (e) {
      parsedMetrics = { info: data.metrics };
    }
  }

  return await db.abtest.create({
    data: {
      campaign_id: Number(data.campaign_id),
      variant_name: data.variant_name,
      metrics: parsedMetrics ? JSON.stringify(parsedMetrics) : null 
    }
  });
};

export const getAllABTests = async () => {
  return await db.abtest.findMany({
    include: {
      campaign: true 
    }
  });
};

export const updateABTest = async (id, data) => {
  let parsedMetrics = undefined;
  if (data.metrics !== undefined) {
    if (data.metrics && data.metrics.trim() !== "") {
      try {
        parsedMetrics = JSON.stringify(JSON.parse(data.metrics));
      } catch (e) {
        parsedMetrics = JSON.stringify({ info: data.metrics });
      }
    } else {
      parsedMetrics = null;
    }
  }

  return await db.abtest.update({
    where: { id: Number(id) },
    data: {
      campaign_id: data.campaign_id ? Number(data.campaign_id) : undefined,
      variant_name: data.variant_name,
      metrics: parsedMetrics
    }
  });
};

export const deleteABTest = async (id) => {
  return await db.abtest.delete({ where: { id: Number(id) } });
};