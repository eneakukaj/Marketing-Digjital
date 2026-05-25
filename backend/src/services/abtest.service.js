import db from "../../database/db.js";

export const createABTest = async (data) => {
  const defaultMetrics = {
    variant_a: {
      name: data.variant_a_name || "Variant A",
      clicks: Number(data.variant_a_clicks) || 0,
      conversions: Number(data.variant_a_conversions) || 0,
      votes: 0
    },
    variant_b: {
      name: data.variant_b_name || "Variant B",
      clicks: Number(data.variant_b_clicks) || 0,
      conversions: Number(data.variant_b_conversions) || 0,
      votes: 0
    },
    voted_users: []
  };

  return await db.abtest.create({
    data: {
      campaign_id: Number(data.campaign_id),
      variant_name: data.variant_name,
      metrics: JSON.stringify(defaultMetrics),
      user_id: data.user_id ? Number(data.user_id) : null
    }
  });
};

export const getABTestById = async (id) => {
  return await db.abtest.findUnique({
    where: { id: Number(id) }
  });
};

export const getAllABTests = async () => {
  return await db.abtest.findMany({
    include: { campaign: true }
  });
};

export const updateABTest = async (id, data) => {
  return await db.abtest.update({
    where: { id: Number(id) },
    data: {
      variant_name: data.variant_name,
      campaign_id: Number(data.campaign_id),
      metrics: data.metrics
    }
  });
};

export const deleteABTest = async (id) => {
  return await db.abtest.delete({
    where: { id: Number(id) }
  });
};

export const voteABTest = async (id, variant, userId) => {
  const currentTest = await db.abtest.findUnique({
    where: { id: Number(id) }
  });

  if (!currentTest) throw new Error("A/B test not found");

  let parsedMetrics = {};
  try {
    parsedMetrics = currentTest.metrics ? JSON.parse(currentTest.metrics) : {};
  } catch (e) {
    throw new Error("Invalid metrics data format");
  }

  if (!parsedMetrics.voted_users) {
    parsedMetrics.voted_users = [];
  }

  if (!parsedMetrics.variant_a) parsedMetrics.variant_a = { name: "Variant A", clicks: 0, conversions: 0, votes: 0 };
  if (!parsedMetrics.variant_b) parsedMetrics.variant_b = { name: "Variant B", clicks: 0, conversions: 0, votes: 0 };
  if (!parsedMetrics.voted_users) parsedMetrics.voted_users = [];

  if (userId && parsedMetrics.voted_users.includes(userId)) {
    throw new Error("You have already voted on this A/B test");
  }

  if (variant === "variant_a" || variant === "variant_b") {
    parsedMetrics[variant].votes = (Number(parsedMetrics[variant].votes) || 0) + 1;
    if (userId) {
      parsedMetrics.voted_users.push(userId);
    }
  } else {
    throw new Error("Invalid variant selected for voting");
  }

  return await db.abtest.update({
    where: { id: Number(id) },
    data: {
      metrics: JSON.stringify(parsedMetrics)
    }
  });
};