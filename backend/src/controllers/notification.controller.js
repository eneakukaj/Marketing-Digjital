import { 
  getUserNotifications, 
  markNotificationAsRead, 
  toggleNotificationPreference,
  getNotificationPreference
} from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const preference = await getNotificationPreference(userId);

    if (!preference || !preference.notifications_enabled) {
      return res.json([]); 
    }

    const notifications = await getUserNotifications(userId);
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await markNotificationAsRead(id);
    res.json({ message: "Notification marked as read" });
  } catch (e) {
    res.status(400).json({ message: "Failed to update notification" });
  }
};
export const toggleNotifications = async (req, res) => {
  try {
    const { enabled } = req.body;
    const userId = Number(req.user.id);

    const result = await toggleNotificationPreference(userId, enabled);
    res.json(result);
  } catch (e) {
    res.status(400).json({ 
      message: "Failed to update notification settings",
      details: e.message 
    });
  }
};

export const getStatus = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const result = await getNotificationPreference(userId);
    
    res.json(result || { notifications_enabled: false });
  } catch (e) {
    res.status(500).json({ 
      message: "An error occurred while fetching notification status" 
    });
  }
};