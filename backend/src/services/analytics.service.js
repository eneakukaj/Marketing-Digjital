import prisma from "../../database/db.js";

export const getAllAnalytics = async () => {
  return await prisma.analytics.findMany({
    include: {
      campaign: { select: { emertimi: true } },
      channel: { select: { emertimi: true, lloji: true } }
    }
  });
};

export const getAnalyticsById = async (id) => {
  return await prisma.analytics.findUnique({
    where: { id: Number(id) },
    include: { campaign: true, channel: true }
  });
};



export const createAnalyticsEntry = async (data) => {
  return await prisma.analytics.create({
    data: {
      campaign_id: Number(data.campaign_id),
      channel_id: Number(data.channel_id),
      klikime: Number(data.klikime || 0),
      shikime: Number(data.shikime || 0),
      konvertime: Number(data.konvertime || 0),
      cmimi_per_klikim: parseFloat(data.cmimi_per_klikim || 0)
    }
  });
};

export const updateAnalyticsEntry = async (id, data) => {
  return await prisma.analytics.update({
    where: { id: Number(id) },
    data: {
      campaign_id: Number(data.campaign_id),
      channel_id: Number(data.channel_id),
      klikime: Number(data.klikime || 0),
      shikime: Number(data.shikime || 0),
      konvertime: Number(data.konvertime || 0),
      cmimi_per_klikim: parseFloat(data.cmimi_per_klikim || 0)
    }
  });
};

export const deleteAnalyticsEntry = async (id) => {
  return await prisma.analytics.delete({
    where: { id: Number(id) }
  });
};



export const getAllLeads = async () => {
  return await prisma.leads.findMany({
    include: {
      campaign: { select: { id: true, emertimi: true } }
    },
    orderBy: { id: 'desc' }
  });
};


export const createLeadEntry = async (data) => {
  return await prisma.leads.create({
    data: {
      emri: data.emri,
      mbiemri: data.mbiemri,
      email: data.email,
      phone_number: data.phone_number,
      statusi: data.statusi || 'aktiv',
      campaign_id: data.campaign_id ? Number(data.campaign_id) : null
    }
  });
};


export const updateLeadEntry = async (id, data) => {
  return await prisma.leads.update({
    where: { id: Number(id) },
    data: {
      emri: data.emri,
      mbiemri: data.mbiemri,
      email: data.email,
      phone_number: data.phone_number,
      statusi: data.statusi,
      campaign_id: data.campaign_id ? Number(data.campaign_id) : null
    }
  });
};


export const deleteLeadEntry = async (id) => {
  return await prisma.leads.delete({
    where: { id: Number(id) }
  });
};