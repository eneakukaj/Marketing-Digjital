export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessTokenExpiresIn: "1h",
  refreshTokenExpiresIn: "7d",
};
