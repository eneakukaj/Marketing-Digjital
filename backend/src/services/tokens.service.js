import prisma from "../../database/db.js";

export const getAllTokensService = async (userId) => {
  return await prisma.refreshtokens.findMany({
    where: {
      user_id: userId,  
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const revokeTokenService = async (id) => {
  return await prisma.refreshtokens.update({
    where: {
      id: Number(id),
    },
    data: {
      revoked: new Date(),
    },
  });
};

export const deleteTokenService = async (id) => {
  return await prisma.refreshtokens.delete({
    where: {
      id: Number(id),
    },
  });
};