import {
  register,
  login,
  refresh,
  logout,
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Error (Register):", err);
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
     res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
      user: result.user,
      roles: result.roles,
      accessToken: result.accessToken,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "No refresh token" });
    }
    const result = await refresh(token);
    res.json({
      message: "Token refreshed",
      accessToken: result.accessToken,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    await logout(token);

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};