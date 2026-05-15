import {
  getAllTokensService,
  revokeTokenService,
  deleteTokenService,
} from "../services/tokens.service.js";
import { createNotification } from "../services/notification.service.js";

export const getTokensController = async (req, res) => {
  try {
    const tokens = await getAllTokensService(req.user.id);

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const revokeTokenController = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await revokeTokenService(id);

    await createNotification(
      req.user.id,
      `Session token #${id} belonging to User ID #${token.user_id} was successfully revoked.`
    );
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTokenController = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await deleteTokenService(id);
    await createNotification(
      req.user.id,
      `Token record #${id} belonging to User ID #${token?.user_id || 'unknown'} was permanently deleted.`
    );
    res.status(200).json({
      message: "Token deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};