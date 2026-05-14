import prisma from "../../database/db.js";

export const createNotification = async (userId, message) => {
  const user = await prisma.users.findUnique({
    where: { id: Number(userId) },
    select: { notifications_enabled: true }
  });

  if (!user || !user.notifications_enabled) return null;

  return await prisma.notifications.create({
    data: {
      user_id: Number(userId),
      message
    }
  });
};

export const getUserNotifications = async (userId) => {
  return await prisma.notifications.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_at: "desc" },
    take: 15
  });
};

export const markNotificationAsRead = async (id) => {
  return await prisma.notifications.update({
    where: { id: Number(id) },
    data: { read_status: true }
  });
};

export const toggleNotificationPreference = async (userId, enabled) => {
  const uId = Number(userId);
  
  return await prisma.users.update({
    where: { id: uId },
    data: { 
      notifications_enabled: enabled 
    },
    select: { notifications_enabled: true }
  });
};

export const getNotificationPreference = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: Number(userId) },
    select: { notifications_enabled: true }
  });
};