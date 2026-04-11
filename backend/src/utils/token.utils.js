import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      roles: user.roles,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.accessTokenExpiresIn }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    jwtConfig.secret,
    { expiresIn: jwtConfig.refreshTokenExpiresIn }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

