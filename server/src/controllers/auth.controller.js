import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

const signRefreshToken = (user) =>
  jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

// POST /api/v1/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "CUSTOMER" } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email, and password are required",
        });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const validRole = ["CUSTOMER", "EDITOR", "ADMIN"].includes(role)
      ? role
      : "CUSTOMER";
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: validRole,
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// POST /api/v1/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  if (user.accountStatus === "SUSPENDED") {
    return res
      .status(403)
      .json({ success: false, message: "Account is suspended" });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLoginIp: req.ip },
  });

  res.cookie("jid", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    success: true,
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/v1/auth/refresh
export const refreshSession = async (req, res) => {
  const token = req.cookies.jid;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No refresh token cookie" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (
      !user ||
      user.refreshToken !== token ||
      user.accountStatus === "SUSPENDED"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Session revoked" });
    }

    const newAccessToken = signAccessToken(user);
    return res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};
