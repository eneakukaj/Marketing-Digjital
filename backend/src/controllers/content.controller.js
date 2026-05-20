import {
  getAllContents,
  createContent,
  updateContent,
  deleteContent,
} from "../services/content.service.js";
import { createNotification } from "../services/notification.service.js";

export const getContents = async (req, res) => {
  try {
    const contents = await getAllContents();
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addContent = async (req, res) => {
  try {
    const content = await createContent(req.body);
    await createNotification(req.user.id,`Content '${content.title || 'New Item'}' was created successfully.`);
    res.status(201).json({
      message: "Content created successfully",
      content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editContent = async (req, res) => {
  try {
    const content = await updateContent(req.params.id, req.body);
    await createNotification(req.user.id,`Content '${content.title || req.params.id}' was updated successfully.`);
    res.json({
      message: "Content updated successfully",
      content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeContent = async (req, res) => {
  try {
    await deleteContent(req.params.id);
    await createNotification(req.user.id,`Content (ID: #${req.params.id}) was deleted successfully.`);
    res.json({
      message: "Content deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};