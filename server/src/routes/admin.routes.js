import express from "express";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import {
  createCuratedProduct,
  updateAccountStatus,
  createCategory,
  getCategories,
} from "../controllers/core.controller.js";

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// Category routes
router.get("/categories", getCategories);
router.post("/categories", requireRole(["EDITOR", "ADMIN"]), createCategory);

// POST /api/v1/admin/products - Create curated product (EDITOR or ADMIN)
router.post(
  "/products",
  requireRole(["EDITOR", "ADMIN"]),
  createCuratedProduct,
);

// PATCH /api/v1/admin/accounts/:id/status - Update account status (ADMIN only)
router.patch(
  "/accounts/:id/status",
  requireRole(["ADMIN"]),
  updateAccountStatus,
);

export default router;
