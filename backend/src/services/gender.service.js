import db from "../../database/db.js";

export const createGender = async (data) => {
  return await db.gender.create({
    data: {
      name: data.name,
    },
  });
};

export const getAllGenders = async () => {
  return await db.gender.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getGenderById = async (id) => {
  return await db.gender.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      audiences: true,
    },
  });
};

export const updateGender = async (id, data) => {
  return await db.gender.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
    },
  });
};

export const deleteGender = async (id) => {
  return await db.gender.delete({
    where: {
      id: Number(id),
    },
  });
};


