import {
  getAllChannels,
  getChannelStats,
  createChannel,
  updateChannel,
  deleteChannel
} from "../services/channel.service.js";
import { createNotification } from "../services/notification.service.js";

export const getChannelsController = async (req, res) => {
  try {
    const channels = await getAllChannels();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching channels.", error: error.message });
  }
};

export const getChannelStatsController = async (req, res) => {
  try {
    const stats = await getChannelStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching channel statistics.", error: error.message });
  }
};

export const createChannelController = async (req, res) => {
  try {
    const channel = await createChannel(req.body);
    await createNotification(req.user.id,`Channel '${channel.name || 'New Channel'}' was created successfully.`);
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error while creating channel.", error: error.message });
  }
};

export const updateChannelController = async (req, res) => {
  try {
    const channel = await updateChannel(req.params.id, req.body);
    await createNotification(req.user.id,`Channel '${channel.name || req.params.id}' was updated successfully.`);
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error while updating channel.", error: error.message });
  }
};

export const deleteChannelController = async (req, res) => {
  try {
    await deleteChannel(req.params.id);
    await createNotification(req.user.id, `Channel (ID: #${req.params.id}) was deleted successfully.`);
    res.status(200).json({ message: "Channel deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting channel.", error: error.message });
  }
};