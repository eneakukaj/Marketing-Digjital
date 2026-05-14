import prisma from "../../database/db.js";
import { hashPassword } from "../utils/password.utils.js";

export const getAllUsers = async () => {
  return await prisma.users.findMany({
    include: {
      userroles: {
        include: {
          role: true
        }
      }
    }
  });
};

export const getUserById = async (id) => {
  return await prisma.users.findUnique({
    where: { id: Number(id) },
    include: {
      userroles: {
        include: {
          role: true
        }
      }
    }
  });
};

export const createUser = async (data) => {
  const tempPassword = Math.random().toString(36).slice(-8);

  const hashedPassword = await hashPassword(tempPassword);

  const user = await prisma.users.create({
    data: {
      emri: data.emri,
      mbiemri: data.mbiemri,
      email: data.email,
      password_hash: hashedPassword,
      statusi: data.statusi || "aktiv"
    },
    include: {
      userroles: { 
        include: {
           role: true 
          }
     }
    }
  });
  return { user, temporaryPassword: tempPassword };
};

export const updateUser = async (id, data) => {
  return await prisma.users.update({
    where: { id: Number(id) },
    data: {
      emri: data.emri,
      mbiemri: data.mbiemri,
      email: data.email,
      statusi: data.statusi
    },
    include: {
      userroles: {
        include: {
          role: true
        }
      }
    }
  });
};

export const deleteUser = async (id) => {
  await prisma.userroles.deleteMany({ where: { user_id: Number(id) } });
  return await prisma.users.delete({ where: { id: Number(id) } });
};

export const changeUserRole = async (user_id, role_id) => {
  const uId = Number(user_id);
  const rId = Number(role_id);


  await prisma.userroles.deleteMany({ where: { user_id: uId } });

  if (!rId) return { message: "Role removed" };

  return await prisma.userroles.create({
    data: {
      user_id: uId,
      role_id: rId
    },
    include: { role: true }
  });
};