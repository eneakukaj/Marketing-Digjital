import db from "../../database/db.js";

export const createABTest = async (data) => {
  return await db.ab_tests.create({
    data: {
      campaign_id: Number(data.campaign_id),
      emri_testit: data.emri_testit,
      metrika_klikimeve: Number(data.metrika_klikimeve) || 0,
      buxheti_shpenzuar: Number(data.buxheti_shpenzuar) || 0,
      statusi: data.statusi || "active"
    }
  });
};

export const getAllABTests = async () => {
  return await db.ab_tests.findMany({
    include: { campaigns: true }
  });
};

export const updateABTest = async (id, data) => {
  return await db.ab_tests.update({
    where: { id: Number(id) },
    data: {
      campaign_id: data.campaign_id ? Number(data.campaign_id) : undefined,
      emri_testit: data.emri_testit,
      metrika_klikimeve: data.metrika_klikimeve ? Number(data.metrika_klikimeve) : undefined,
      buxheti_shpenzuar: data.buxheti_shpenzuar ? Number(data.buxheti_shpenzuar) : undefined,
      statusi: data.statusi
    }
  });
};

export const deleteABTest = async (id) => {
  return await db.ab_tests.delete({ where: { id: Number(id) } });
};