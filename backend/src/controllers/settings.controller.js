import {
  getProfileService,
  updateProfileService,
  changePasswordService,
  getLoginHistoryService
} from "../services/settings.service.js";

export const getProfileController = async (req, res) => {
  try {
    const data = await getProfileService(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const data = await updateProfileService(req.user.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    await changePasswordService(
      req.user.id,
      req.body.oldPassword,
      req.body.newPassword
    );

    res.json({ message: "Password changed" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLoginHistoryController = async (req, res) => {
  try {
    const data = await getLoginHistoryService(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};