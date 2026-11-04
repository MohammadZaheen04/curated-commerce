import express from "express";
import {
  getCuratedCatalog,
  getCategories,
  getProductBySlug,
} from "../controllers/core.controller.js";

const router = express.Router();

// GET /api/v1/products/categories - Public categories list
router.get("/categories", getCategories);

// GET /api/v1/products - Public curated catalog (paginated, filterable, searchable)
router.get("/", getCuratedCatalog);

// GET /api/v1/products/:slug - Single product detail
router.get("/:slug", getProductBySlug);

export default router;
