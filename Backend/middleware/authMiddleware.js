import { sql } from "../config/db.js";

export const attachCurrentUser = async (req, _res, next) => {
  const rawUserId = req.header("x-user-id");

  if (!rawUserId) {
    req.currentUser = null;
    return next();
  }

  const userId = Number(rawUserId);

  if (!Number.isInteger(userId) || userId <= 0) {
    req.currentUser = null;
    return next();
  }

  try {
    const users = await sql`
      SELECT id, full_name, phone_number, role, created_at
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;

    req.currentUser = users[0] || null;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.currentUser.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
