import {
  getAllTokensService,
  revokeTokenService,
  deleteTokenService,
} from "../services/tokensService.js";

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

    await deleteTokenService(id);

    res.status(200).json({
      message: "Token deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};