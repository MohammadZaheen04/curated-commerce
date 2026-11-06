import express from "express";
import {
  getCuratedCatalog,
  getCategories,
  getProductBySlug,
  createProductReview,
  getEditorialPosts,
} from "../controllers/core.controller.js";

const router = express.Router();

// GET /api/v1/products/categories - Public categories list
router.get("/categories", getCategories);

// GET /api/v1/products/editorial - Public editorial posts
router.get("/editorial", getEditorialPosts);

// GET /api/v1/products - Public curated catalog (paginated, filterable, searchable)
router.get("/", getCuratedCatalog);

// GET /api/v1/products/:slug - Single product detail
router.get("/:slug", getProductBySlug);

// POST /api/v1/products/:slug/reviews - Submit a verified review
router.post("/:slug/reviews", createProductReview);

export default router;
