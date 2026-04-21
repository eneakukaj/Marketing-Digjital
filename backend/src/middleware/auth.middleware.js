import prisma from "../../database/db.js";
import { verifyToken } from "../utils/token.utils.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);

    const user=await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { statusi: true, lockout_enabled: true }
    });

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    if(user.statusi !=="aktiv" || user.lockout_enabled){
      return res.status(403).json({
        message: "Your account is locked or inactive."
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
