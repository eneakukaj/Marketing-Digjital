import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../services/campaign.service.js";

export const createCampaignController = async (req, res) => {
  try {
    const campaign = await createCampaign({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.log("CAMPAIGN CREATE ERROR:", error);
    res.status(500).json({ message: "Error while creating campaign" });
  }
};

export const getAllCampaignsController = async (req, res) => {
  try {
    const campaigns = await getAllCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching campaigns" });
  }
};

export const getCampaignByIdController = async (req, res) => {
  try {
    const campaign = await getCampaignById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching campaign" });
  }
};

export const updateCampaignController = async (req, res) => {
  try {
    const campaign = await updateCampaign(req.params.id, req.body);
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Error while updating campaign" });
  }
};

export const deleteCampaignController = async (req, res) => {
  try {
    await deleteCampaign(req.params.id);
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting campaign" });
  }
};