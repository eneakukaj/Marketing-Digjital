import prisma from "../../database/db.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/password.utils.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.utils.js";

const MAX_FAILED_ATTEMPTS = 5;

export const register = async (data) => {

if (!data.emri || !data.mbiemri || !data.email || !data.password || !data.phone_number) {
  throw new Error("All fields are required");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(data.email)) {
  throw new Error("Invalid email format");
}

if (data.password.length < 6) {
  throw new Error("Password must be at least 6 characters long");
}

  const existing = await prisma.users.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashed = await hashPassword(data.password);

  const user = await prisma.users.create({
    data: {
      emri: data.emri,
      mbiemri: data.mbiemri,
      email: data.email,
      password_hash: hashed,
      phone_number: data.phone_number,
    },
  });

  const defaultRole = await prisma.roles.findUnique({
    where: { normalized_name: "USER" },
  });

  if (!defaultRole) {
    throw new Error("Default role USER not found");
  }

  await prisma.userroles.create({
    data: {
      user_id: user.id,
      role_id: defaultRole.id,
    },
  });

  delete user.password_hash;

  return user;
};

export const login = async (email, password) => {
  
if (!email || !password) {
  throw new Error("Email and password are required");
}
  const user = await prisma.users.findUnique({
    where: { email },
    include: {
      userroles: {
        include: { role: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.statusi !== "aktiv") {
    throw new Error("User is not active");
  }

  if (user.lockout_enabled) {
    throw new Error("User is locked");
  }

  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    const failedCount = user.access_failed_count + 1;

    await prisma.users.update({
      where: { id: user.id },
      data: {
        access_failed_count: failedCount,
        lockout_enabled: failedCount >= MAX_FAILED_ATTEMPTS,
      },
    });

    if (failedCount >= MAX_FAILED_ATTEMPTS) {
      throw new Error("Account locked due to too many failed attempts");
    }

    throw new Error("Invalid credentials");
  }

  await prisma.users.update({
    where: { id: user.id },
    data: {
      access_failed_count: 0,
    },
  });

  const roles = user.userroles.map((r) => r.role.normalized_name);

  if (!roles || roles.length === 0) {
    throw new Error("User has no roles assigned");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    roles,
  });

  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.refreshtokens.create({
    data: {
      user_id: user.id,
      token: refreshToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  delete user.password_hash;

    return {
    user,
    roles,
    accessToken,
    refreshToken,
  };
  
};

export const refresh = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  const stored = await prisma.refreshtokens.findFirst({
    where: { token },
  });

  if (!stored) {
    throw new Error("Invalid refresh token");
  }

  if (stored.expires < new Date()) {
    throw new Error("Refresh token expired");
  }

  const decoded = verifyToken(token);

  const user = await prisma.users.findUnique({
    where: { id: decoded.id },
    include: {
      userroles: {
        include: { role: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.statusi !== "aktiv") {
    throw new Error("User is not active");
  }

  if (user.lockout_enabled) {
    throw new Error("User is locked");
  }

  const roles = user.userroles.map((r) => r.role.normalized_name);

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    roles,
  });

  return { accessToken: newAccessToken };
};

export const logout = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  await prisma.refreshtokens.deleteMany({
    where: { token },
  });

  return { message: "Logged out successfully" };
};