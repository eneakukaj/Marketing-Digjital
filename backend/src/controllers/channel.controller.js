import {
  getAllChannels,
  getChannelStats,
  createChannel,
  updateChannel,
  deleteChannel
} from "../services/channel.service.js";

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
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error while creating channel.", error: error.message });
  }
};

export const updateChannelController = async (req, res) => {
  try {
    const channel = await updateChannel(req.params.id, req.body);
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error while updating channel.", error: error.message });
  }
};

export const deleteChannelController = async (req, res) => {
  try {
    await deleteChannel(req.params.id);
    res.status(200).json({ message: "Channel deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting channel.", error: error.message });
  }
};