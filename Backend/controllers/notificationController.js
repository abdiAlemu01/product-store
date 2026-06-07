import { sql } from "../config/db.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await sql`
      SELECT id, type, title, body, order_id, read_at, created_at
      FROM notifications
      WHERE user_id = ${req.currentUser.id}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const unread = await sql`
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE user_id = ${req.currentUser.id} AND read_at IS NULL
    `;

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: unread[0]?.count || 0,
    });
  } catch (error) {
    console.log("Error in getNotifications", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markNotificationRead = async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await sql`
      UPDATE notifications
      SET read_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${req.currentUser.id}
      RETURNING id, read_at
    `;

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.log("Error in markNotificationRead", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await sql`
      UPDATE notifications
      SET read_at = CURRENT_TIMESTAMP
      WHERE user_id = ${req.currentUser.id} AND read_at IS NULL
    `;

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in markAllNotificationsRead", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
