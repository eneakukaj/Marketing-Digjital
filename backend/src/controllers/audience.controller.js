import {
  getAllAudiences,
  getAudienceById,
  createAudience,
  updateAudience,
  deleteAudience
} from "../services/audience.service.js";
import { createNotification } from "../services/notification.service.js";

export const getAudiencesController = async (req, res) => {
  try {
    const audiences = await getAllAudiences();
    res.json(audiences);
  } catch (e) {
    console.error("AUDIENCE FETCH ERROR:", e);
    res.status(500).json({ message: "Error fetching audiences" });
  }
};

export const getAudienceByIdController = async (req, res) => {
  try {
    const audience = await getAudienceById(req.params.id);
    if (!audience) return res.status(404).json({ message: "Audience not found" });
    res.json(audience);
  } catch (e) {
    res.status(500).json({ message: "Error fetching audience details" });
  }
};

export const createAudienceController = async (req, res) => {
  try {
    const audience = await createAudience(req.body);
    await createNotification(req.user.id,`Audience '${audience.name || 'New Audience'}' was created successfully.`);
    res.status(201).json(audience);
  } catch (e) {
    console.error("CREATE ERROR:", e);
    res.status(400).json({ message: "Failed to create audience" });
  }
};

export const updateAudienceController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID is missing" });

    const audience = await updateAudience(id, req.body);
    await createNotification(req.user.id,`Audience '${audience.name || id}' was updated successfully.`);
    res.json(audience);
  } catch (e) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const deleteAudienceController = async (req, res) => {
  try {
    await deleteAudience(req.params.id);
    await createNotification(req.user.id,`Audience (ID: #${req.params.id}) was deleted successfully.`);
    res.json({ message: "Audience deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Delete failed" });
  }
};