import express from "express";
import {
  login,
  refreshSession,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", register);

// POST /api/v1/auth/login
router.post("/login", login);

// POST /api/v1/auth/refresh
router.post("/refresh", refreshSession);

export default router;
