import { z } from "zod";
import prisma from "../lib/prisma.js";

// 1. Strict Zod Validation: Enforces High-Rated & External CDN Rules
const createProductSchema = z.object({
  sku: z.string().min(4),
  title: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  categoryId: z.string(),
  price: z.number().positive(),
  mrp: z.number().positive(),
  priceTier: z.enum(["BUDGET", "MID_RANGE", "VALUE_LUXURY"]),
  ratingAvg: z
    .number()
    .min(4.2, "Curated products must have a minimum 4.2 rating"),
  curatedVerdict: z
    .string()
    .min(30, "Must include a substantive editor's verdict"),
  specs: z.record(z.any()),
  media: z
    .array(
      z.object({
        cdnUrl: z.string().url("Must be a valid external CDN URL"),
        blurhash: z.string().optional(),
        isPrimary: z.boolean().default(false),
      }),
    )
    .min(1, "At least one external CDN product image is required"),
});

// POST /api/v1/admin/categories
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Name and slug are required" });
    }
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// GET /api/v1/admin/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: { where: { status: "PUBLISHED" } } } },
      },
    });
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/products/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        media: { orderBy: { sortOrder: "asc" } },
        category: { select: { name: true, slug: true } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { user: { select: { name: true } } },
        },
      },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Related: same category, top rated, exclude self
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        status: "PUBLISHED",
        id: { not: product.id },
      },
      include: {
        media: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { ratingAvg: "desc" },
      take: 4,
    });

    return res.json({ success: true, data: product, related });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/v1/admin/products
export const createCuratedProduct = async (req, res) => {
  try {
    const validated = createProductSchema.parse(req.body);
    const { media, ...productData } = validated;

    const product = await prisma.product.create({
      data: {
        ...productData,
        media: { create: media },
      },
      include: { media: true, category: true },
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.errors || error.message,
    });
  }
};

// GET /api/v1/products (Public Curated Feed)
export const getCuratedCatalog = async (req, res) => {
  try {
    const {
      category,
      maxPrice,
      minRating = 4.0,
      sort = "rating",
      q,
      page = 1,
      limit = 24,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(48, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const where = {
      status: "PUBLISHED",
      ratingAvg: { gte: Number(minRating) },
      ...(maxPrice && { price: { lte: Number(maxPrice) } }),
      ...(category && { category: { slug: String(category) } }),
      ...(q && {
        title: { contains: String(q), mode: "insensitive" },
      }),
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
          ? { price: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { ratingAvg: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          media: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
      },
    });
  } catch (err) {
    console.error("[Catalog Query Error]:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch catalog",
      error: err.message,
    });
  }
};

// PATCH /api/v1/admin/accounts/:id/status (Admin Account Governance)
export const updateAccountStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body; // ACTIVE | FLAGGED | SUSPENDED
  const adminId = req.user.id;

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: {
        accountStatus: status,
        // Revoke active refresh token immediately if suspended
        ...(status === "SUSPENDED" && { refreshToken: null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        accountStatus: true,
        role: true,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: adminId,
        targetAccountId: id,
        actionType: `STATUS_CHANGED_TO_${status}`,
        reason: reason || "Manual admin moderation",
      },
    }),
  ]);

  return res.json({ success: true, data: updatedUser });
};
