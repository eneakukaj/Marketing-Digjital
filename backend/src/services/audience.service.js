import prisma from "../../database/db.js";

export const getAllAudiences = async () => {
  return await prisma.audiences.findMany({
    include: {
      campaignaudiences: {
        include: {
          campaign: true
        }
      }
    }
  });
};

export const getAudienceById = async (id) => {
  return await prisma.audiences.findUnique({
    where: { id: Number(id) },
    include: {
      campaignaudiences: true
    }
  });
};

export const createAudience = async (data) => {
  return await prisma.audiences.create({
    data: {
      emertimi: data.emertimi,
      pershkrimi: data.pershkrimi,
      mosha_min: Number(data.mosha_min),
      mosha_max: Number(data.mosha_max),
      gjinia: data.gjinia,
      lokacioni: data.lokacioni,
      interesat: data.interesat
    }
  });
};

export const updateAudience = async (id, data) => {
  return await prisma.audiences.update({
    where: { id: Number(id) },
    data: {
      emertimi: data.emertimi,
      pershkrimi: data.pershkrimi,
      mosha_min: Number(data.mosha_min),
      mosha_max: Number(data.mosha_max),
      gjinia: data.gjinia,
      lokacioni: data.lokacioni,
      interesat: data.interesat
    }
  });
};

export const deleteAudience = async (id) => {
  return await prisma.audiences.delete({
    where: { id: Number(id) }
  });
};