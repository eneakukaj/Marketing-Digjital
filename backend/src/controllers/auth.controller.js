import {
  register,
  login,
  refresh,
  logout,
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await refresh(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await logout(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};