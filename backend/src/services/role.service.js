import prisma from "../../database/db.js";

export const getAllRoles = async () => {
  return await prisma.roles.findMany()
};

export const createRole = async (data) => {
  const { emertimi, pershkrimi } = data;

  return await prisma.roles.create({
    data: {
      emertimi,
      pershkrimi,
      normalized_name: emertimi.toLowerCase()
    }
  });
};

export const updateRole = async (id, data) => {
  return await prisma.roles.update({
    where: { id: Number(id) },
    data: {
      emertimi: data.emertimi,
      pershkrimi: data.pershkrimi,
      normalized_name: data.emertimi?.toLowerCase()
    }
  });
};

export const deleteRole = async (id) => {
  return await prisma.roles.delete({
    where: { id: Number(id) }
  });
};