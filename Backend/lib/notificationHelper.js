import { sql } from "../config/db.js";

export const createNotification = async ({ userId, type, title, body, orderId = null }) => {
  const rows = await sql`
    INSERT INTO notifications (user_id, type, title, body, order_id)
    VALUES (${userId}, ${type}, ${title}, ${body}, ${orderId})
    RETURNING id, user_id, type, title, body, order_id, read_at, created_at
  `;
  return rows[0];
};

export const notifyAdmins = async ({ type, title, body, orderId = null }) => {
  const admins = await sql`SELECT id FROM users WHERE role = 'admin'`;
  const created = [];

  for (const admin of admins) {
    const notification = await createNotification({
      userId: admin.id,
      type,
      title,
      body,
      orderId,
    });
    created.push(notification);
  }

  return created;
};
