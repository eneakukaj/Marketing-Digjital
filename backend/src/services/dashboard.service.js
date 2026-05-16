import prisma from "../../database/db.js";

export const getDashboardOverview = async (userId) => {
  const uId = Number(userId);

  const activeCampaignsCount = await prisma.campaigns.count({
    where: {
      user_id: uId,
      statusi: "aktiv"
    }
  });

  const analyticsAggregation = await prisma.analytics.aggregate({
    _sum: {
      klikime: true
    },
    where: {
      campaign: { user_id: uId }
    }
  });
  const totalClicks = analyticsAggregation._sum.klikime || 0;

  const budgetAggregation = await prisma.budgets.aggregate({
    _sum: {
      shuma_totale: true 
    },
    where: {
      campaign: { user_id: uId }
    }
  });
  const totalRevenue = Number(budgetAggregation._sum.shuma_totale || 0);

  const topChannelData = await prisma.analytics.groupBy({
    by: ['channel_id'],
    _sum: {
      klikime: true
    },
    where: {
      campaign: { user_id: uId }
    },
    orderBy: {
      _sum: {
        klikime: 'desc'
      }
    },
    take: 1
  });

  let topChannelName = "N/A";
  if (topChannelData.length > 0) {
    const channel = await prisma.channels.findUnique({
      where: { id: topChannelData[0].channel_id },
      select: { emertimi: true }
    });
    if (channel) topChannelName = channel.emertimi;
  }

  const channelAnalytics = await prisma.analytics.groupBy({
    by: ['channel_id'],
    _sum: {
      klikime: true
    },
    where: {
      campaign: { user_id: uId }
    }
  });

  const channelMix = await Promise.all(
    channelAnalytics.map(async (item) => {
      const channel = await prisma.channels.findUnique({
        where: { id: item.channel_id },
        select: { emertimi: true }
      });
      return {
        name: channel ? channel.emertimi : "Unknown",
        value: item._sum.klikime || 0
      };
    })
  );

  const activeCampaignsList = await prisma.campaigns.findMany({
    where: {
      user_id: uId,
      statusi: "aktiv"
    },
    select: {
      id: true,
      emertimi: true,
      budgets: {
        select: {
          shuma_totale: true,
          shuma_shpenzuar: true
        }
      }
    },
    take: 3 
  });

  const formattedCampaigns = activeCampaignsList.map((camp) => {
    const budget = camp.budgets[0];
    const totale = budget ? Number(budget.shuma_totale) : 0;
    const shpenzuar = budget ? Number(budget.shuma_shpenzuar) : 0;
    
    let perqindja = 0;
    if (totale > 0) {
      perqindja = Math.round((shpenzuar / totale) * 100);
    }

    return {
      id: camp.id,
      emertimi: camp.emertimi,
      spent: shpenzuar,
      percentage: perqindja
    };
  });

  return {
    cards: {
      activeCampaigns: activeCampaignsCount,
      totalClicks,
      totalRevenue,
      topChannel: topChannelName
    },
    channelMix,
    activeCampaignsProgress: formattedCampaigns
  };
};