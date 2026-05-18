import db from "../../database/db.js";

export const createFeedback = async (data) => {
  return await db.feedback.create({  
    data: {
      ab_test_id: Number(data.ab_test_id), 
      comment: data.komenti,
      user_id: 1 
    }
  });
};

export const getAllFeedbacks = async () => {
  return await db.feedback.findMany({
    include: {
      abtest: true 
    }
  });
};

export const updateFeedback = async (id, data) => {
  return await db.feedback.update({
    where: { id: Number(id) },
    data: {
      ab_test_id: data.ab_test_id ? Number(data.ab_test_id) : undefined,
      comment: data.komenti
    }
  });
};

export const deleteFeedback = async (id) => {
  return await db.feedback.delete({ where: { id: Number(id) } });
};