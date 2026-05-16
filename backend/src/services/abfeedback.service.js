import db from "../../database/db.js";

export const createFeedback = async (data) => {
  return await db.ab_feedbacks.create({
    data: {
      ab_test_id: Number(data.ab_test_id),
      komenti: data.komenti
    }
  });
};

export const getAllFeedbacks = async () => {
  return await db.ab_feedbacks.findMany({
    include: {
      ab_tests: true // Kjo na lejon të shohim se për cilin test është bërë ky feedback
    }
  });
};

export const updateFeedback = async (id, data) => {
  return await db.ab_feedbacks.update({
    where: { id: Number(id) },
    data: {
      ab_test_id: data.ab_test_id ? Number(data.ab_test_id) : undefined,
      komenti: data.komenti
    }
  });
};

export const deleteFeedback = async (id) => {
  return await db.ab_feedbacks.delete({ where: { id: Number(id) } });
};