import db from "../../database/db.js";

export const getAllContents = async () => {
  return await prisma.contents.findMany({
    include: {
      campaign: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const createContent = async (data) => {
  if (!data.campaign_id || !data.titulli) {
    throw new Error("Campaign and title are required");
  }

  return await prisma.contents.create({
    data: {
      campaign_id: Number(data.campaign_id),
      titulli: data.titulli,
      lloji: data.lloji,
      permbajtja: data.permbajtja,
      media_url: data.media_url,
      statusi: data.statusi || "draft",
    },
  });
};

export const updateContent = async (id, data) => {
  return await prisma.contents.update({
    where: {
      id: Number(id),
    },
    data: {
      campaign_id: Number(data.campaign_id),
      titulli: data.titulli,
      lloji: data.lloji,
      permbajtja: data.permbajtja,
      media_url: data.media_url,
      statusi: data.statusi,
    },
  });
};

export const deleteContent = async (id) => {
  return await prisma.contents.delete({
    where: {
      id: Number(id),
    },
  });
};