import db from "../../database/db.js";

export const getAllChannels = async () => {
  return await db.channels.findMany({
    include: {
      campaignchannels: {
        include: {
          campaign: true
        }
      }
    }
  });
};

export const getChannelStats = async () => {
  const totalChannels = await db.channels.count();
  const activeChannels = await db.channels.count({
    where: { statusi: 'aktiv' }
  });

  const budgetAggregation = await db.campaignchannels.aggregate({
    _sum: {
      buxheti_alokuar: true
    }
  });

  const typeStats = await db.channels.groupBy({
    by: ['lloji'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 1
  });

  return {
    totalChannels,
    activeChannels,
    totalBudget: budgetAggregation._sum.buxheti_alokuar ? Number(budgetAggregation._sum.buxheti_alokuar) : 0,
    mostUsedType: typeStats[0]?.lloji || 'N/A'
  };
};

export const createChannel = async (data) => {
  const { emertimi, lloji, pershkrimi, url, isSocial, platforma, username, user_id, statusi, campaign_id, buxheti_alokuar } = data;

  if (isSocial) {
    return await db.channels.create({
      data: {
        emertimi: `${platforma} (@${username})`,
        lloji: "Custom Social",
        pershkrimi: pershkrimi || `Linked ${platforma} account.`,
        url: url || `https://${platforma.toLowerCase()}.com/${username}`,
        statusi: statusi || 'aktiv',
      },
    });
   await db.socialmediaaccounts.create({
      data: {
        user_id: Number(user_id),
        channel_id: channel.id,
        platforma,
        username,
        followers: 0,
        statusi: "aktiv",
      },
    });
  }
 const channelData = {
    emertimi,
    lloji,
    pershkrimi,
    url,
    statusi: statusi || "aktiv", 
  };

  
  if (campaign_id && !isNaN(Number(campaign_id))) {
    channelData.campaignchannels = {
      create: {
        campaign_id: Number(campaign_id),
        buxheti_alokuar: buxheti_alokuar ? Number(buxheti_alokuar) : 0,
        statusi: 'aktiv' 
      }
    };
  }
  return await db.channels.create({
    data: channelData,
    include: {
      campaignchannels: true,
    },
  });
};

export const updateChannel = async (id, data) => {
  const { emertimi, lloji, pershkrimi, url, statusi, campaign_id, buxheti_alokuar } = data;

  return await db.$transaction(async (tx) => {
    const updatedChannel = await tx.channels.update({
      where: { id: Number(id) },
      data: { emertimi, lloji, pershkrimi, url, statusi }
    });

    if (campaign_id && !isNaN(Number(campaign_id))) {
      const existingLink = await tx.campaignchannels.findFirst({
        where: { channel_id: Number(id) }
      });

      if (existingLink) {
        await tx.campaignchannels.update({
          where: { id: existingLink.id },
          data: {
            campaign_id: Number(campaign_id),
            buxheti_alokuar: buxheti_alokuar ? Number(buxheti_alokuar) : 0
          }
        });
      } else {
        await tx.campaignchannels.create({
          data: {
            campaign_id: Number(campaign_id),
            channel_id: updatedChannel.id,
            buxheti_alokuar: buxheti_alokuar ? Number(buxheti_alokuar) : 0,
            statusi: 'aktiv'
          }
        });
      }
    }

    return updatedChannel;
  });
};

export const deleteChannel = async (id) => {
  return await db.$transaction(async (tx) => {
    await tx.campaignchannels.deleteMany({
      where: { channel_id: Number(id) }
    });

    const deletedChannel = await tx.channels.delete({
      where: { id: Number(id) }
    });

    return deletedChannel;
  });
};