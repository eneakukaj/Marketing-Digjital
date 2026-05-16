import db from "../../database/db.js";

export const createCampaign = async (data) => {
  const campaign = await db.campaigns.create({
    data: {
      emertimi: data.emertimi,
      pershkrimi: data.pershkrimi,
      buxheti: Number(data.buxheti),
      data_fillimit: new Date(data.data_fillimit),
      data_perfundimit: new Date(data.data_perfundimit),
      statusi: data.statusi,
      objektivi: data.objektivi,
      user_id: Number(data.user_id),
    },
  });

  if (data.channel_id) {
    await db.campaignchannels.create({
      data: {
        campaign_id: campaign.id,
        channel_id: Number(data.channel_id),
        buxheti_alokuar: Number(data.buxheti),
        statusi: "aktiv",
      },
    });
  }

  return campaign;
};

export const getAllCampaigns = async () => {
  return await db.campaigns.findMany({
    include: {
      campaignchannels: true,
    },
  });
};

export const getCampaignById = async (id) => {
  return await db.campaigns.findUnique({
    where: { id: Number(id) },
    include: {
      campaignchannels: true,
    },
  });
};

export const updateCampaign = async (id, data) => {
  const campaign = await db.campaigns.update({
    where: { id: Number(id) },
    data: {
      emertimi: data.emertimi,
      pershkrimi: data.pershkrimi,
      buxheti: data.buxheti ? Number(data.buxheti) : undefined,
      data_fillimit: data.data_fillimit ? new Date(data.data_fillimit) : undefined,
      data_perfundimit: data.data_perfundimit ? new Date(data.data_perfundimit) : undefined,
      statusi: data.statusi,
      objektivi: data.objektivi,
    },
  });

  if (data.channel_id) {
    const existingLink = await db.campaignchannels.findFirst({
      where: { campaign_id: Number(id) },
    });

    if (existingLink) {
      await db.campaignchannels.update({
        where: { id: existingLink.id },
        data: {
          channel_id: Number(data.channel_id),
          buxheti_alokuar: data.buxheti ? Number(data.buxheti) : existingLink.buxheti_alokuar,
        },
      });
    } else {
      await db.campaignchannels.create({
        data: {
          campaign_id: Number(id),
          channel_id: Number(data.channel_id),
          buxheti_alokuar: data.buxheti ? Number(data.buxheti) : 0,
          statusi: "aktiv",
        },
      });
    }
  }

  return campaign;
};

export const deleteCampaign = async (id) => {
  await db.campaignchannels.deleteMany({
    where: { campaign_id: Number(id) },
  });

  return await db.campaigns.delete({
    where: { id: Number(id) },
  });
};