import jwt from "jsonwebtoken";
import { verifyToken, clerkClient } from "@clerk/express";
import prisma from "../src/lib/prisma.js";

/**
 * Dual Authentication Middleware
 * 1. Checks if the Bearer token is a valid Clerk session token.
 *    If valid, syncs/maps with Prisma User (preserving IDs, roles, and status).
 * 2. If Clerk verification fails, falls back to legacy JWT verification.
 * 3. Returns 401 only if both verifications fail.
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Missing or invalid authorization header",
      });
  }

  const token = authHeader.split(" ")[1];

  // --- Strategy 1: Clerk Token Verification ---
  if (process.env.CLERK_SECRET_KEY) {
    try {
      const verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (verified && verified.sub) {
        const clerkUserId = verified.sub;

        // 1. Check if user already mapped by clerkId
        let user = await prisma.user.findUnique({
          where: { clerkId: clerkUserId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            accountStatus: true,
            clerkId: true,
          },
        });

        // 2. If not found by clerkId, lookup Clerk profile to find/link by email
        if (!user) {
          try {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            const primaryEmail =
              clerkUser.emailAddresses?.find(
                (e) => e.id === clerkUser.primaryEmailAddressId,
              )?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;

            if (primaryEmail) {
              // Look for existing user with same email (e.g. admin@curated.com)
              const existingByEmail = await prisma.user.findUnique({
                where: { email: primaryEmail },
              });

              if (existingByEmail) {
                // Safely link clerkId to existing user, preserving their Prisma ID & role
                user = await prisma.user.update({
                  where: { id: existingByEmail.id },
                  data: { clerkId: clerkUserId },
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    accountStatus: true,
                    clerkId: true,
                  },
                });

                // Sync role to Clerk public metadata if not set
                if (clerkUser.publicMetadata?.role !== existingByEmail.role) {
                  await clerkClient.users
                    .updateUserMetadata(clerkUserId, {
                      publicMetadata: { role: existingByEmail.role },
                    })
                    .catch(() => {});
                }
              } else {
                // Provision new customer account in Prisma
                const fullName =
                  [clerkUser.firstName, clerkUser.lastName]
                    .filter(Boolean)
                    .join(" ") || primaryEmail.split("@")[0];
                const assignedRole =
                  clerkUser.publicMetadata?.role &&
                  ["CUSTOMER", "EDITOR", "ADMIN"].includes(
                    clerkUser.publicMetadata.role,
                  )
                    ? clerkUser.publicMetadata.role
                    : "CUSTOMER";

                user = await prisma.user.create({
                  data: {
                    clerkId: clerkUserId,
                    email: primaryEmail,
                    name: fullName,
                    passwordHash: "CLERK_OAUTH_MANAGED",
                    role: assignedRole,
                    accountStatus: "ACTIVE",
                  },
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    accountStatus: true,
                    clerkId: true,
                  },
                });
              }
            }
          } catch (clerkFetchErr) {
            console.error(
              "[Clerk Profile Fetch Error]:",
              clerkFetchErr.message,
            );
          }
        }

        if (user) {
          if (user.accountStatus === "SUSPENDED") {
            return res.status(403).json({
              success: false,
              message: "Account suspended or session revoked by administrator.",
            });
          }
          req.user = user;
          req.auth = { userId: clerkUserId, claims: verified };
          return next();
        }
      }
    } catch (clerkErr) {
      // Not a valid Clerk token, fall through to Legacy JWT verification
    }
  }

  // --- Strategy 2: Legacy JWT Verification (Migration Fallback) ---
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accountStatus: true,
      },
    });

    if (!user || user.accountStatus === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        message: "Account suspended or session revoked by administrator.",
      });
    }

    req.user = user;
    return next();
  } catch (legacyError) {
    return res
      .status(401)
      .json({ success: false, message: "Access token expired or invalid" });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};
