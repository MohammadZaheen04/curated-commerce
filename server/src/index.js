import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Parsing Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://curated-commerce-ruddy.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        if (
          allowedOrigins.includes(origin) ||
          hostname.endsWith(".vercel.app") ||
          hostname === "localhost"
        ) {
          return callback(null, true);
        }
      } catch {}
      // Reflect origin so valid storefront frontends are not blocked
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const publicReadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/products", publicReadLimiter, productRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/checkout", checkoutRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Process Safety Handlers
process.on("unhandledRejection", (reason, promise) => {
  console.warn(
    "[Server Warning] Unhandled Promise Rejection:",
    reason?.message || reason,
  );
});
process.on("uncaughtException", (err) => {
  console.error("[Server Error] Uncaught Exception:", err.message);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
