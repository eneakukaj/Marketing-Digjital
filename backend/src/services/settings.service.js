import prisma from "../../database/db.js";
import bcrypt from "bcryptjs";

export const getProfileService = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      emri: true,
      mbiemri: true,
      email: true,
      phone_number: true,
      created_at: true,
    },
  });
};

export const updateProfileService = async (userId, data) => {
  return await prisma.users.update({
    where: { id: userId },
    data: {
      emri: data.emri,
      mbiemri: data.mbiemri,
      email: data.email,
      phone_number: data.phone_number,
    },
  });
};

export const changePasswordService = async (userId, oldPass, newPass) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });

  const match = await bcrypt.compare(oldPass, user.password_hash);
  if (!match) throw new Error("Old password incorrect");

  const hashed = await bcrypt.hash(newPass, 10);

  return prisma.users.update({
    where: { id: userId },
    data: { password_hash: hashed },
  });
};

export const getLoginHistoryService = async (userId) => {
  return prisma.refreshtokens.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      created_at: true,
      expires: true,
      revoked: true,
      token: true,
    },
  });
};