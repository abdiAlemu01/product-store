import { sql } from "../config/db.js";
import { createNotification } from "../lib/notificationHelper.js";

const getOrCreateConversation = async (customerId) => {
  const existing = await sql`
    SELECT id, customer_id, updated_at
    FROM conversations
    WHERE customer_id = ${customerId}
    LIMIT 1
  `;

  if (existing.length > 0) {
    return existing[0];
  }

  const created = await sql`
    INSERT INTO conversations (customer_id)
    VALUES (${customerId})
    RETURNING id, customer_id, updated_at
  `;

  return created[0];
};

export const openConversation = async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: "Customer is required" });
  }

  try {
    if (req.currentUser.role === "admin") {
      const customers = await sql`
        SELECT id, full_name, phone_number
        FROM users
        WHERE id = ${customerId} AND role = 'customer'
        LIMIT 1
      `;

      if (customers.length === 0) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      const conversation = await getOrCreateConversation(customerId);

      return res.status(200).json({
        success: true,
        data: {
          ...conversation,
          customer_name: customers[0].full_name,
          customer_phone: customers[0].phone_number,
        },
      });
    }

    if (req.currentUser.role === "customer" && req.currentUser.id === Number(customerId)) {
      const conversation = await getOrCreateConversation(req.currentUser.id);
      return res.status(200).json({ success: true, data: conversation });
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  } catch (error) {
    console.log("Error in openConversation", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    if (req.currentUser.role === "admin") {
      const conversations = await sql`
        SELECT
          c.id,
          c.customer_id,
          c.updated_at,
          u.full_name AS customer_name,
          u.phone_number AS customer_phone,
          (
            SELECT body FROM messages m
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) AS last_message,
          (
            SELECT COUNT(*)::int FROM messages m
            WHERE m.conversation_id = c.id
              AND m.sender_id != ${req.currentUser.id}
              AND m.read_at IS NULL
          ) AS unread_count
        FROM conversations c
        JOIN users u ON u.id = c.customer_id
        ORDER BY c.updated_at DESC
      `;

      return res.status(200).json({ success: true, data: conversations });
    }

    const conversation = await getOrCreateConversation(req.currentUser.id);

    res.status(200).json({
      success: true,
      data: [conversation],
    });
  } catch (error) {
    console.log("Error in getConversations", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;

  try {
    const conversations = await sql`
      SELECT id, customer_id FROM conversations WHERE id = ${id} LIMIT 1
    `;

    if (conversations.length === 0) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const conversation = conversations[0];

    if (
      req.currentUser.role === "customer" &&
      conversation.customer_id !== req.currentUser.id
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await sql`
      SELECT
        m.id,
        m.body,
        m.order_id,
        m.read_at,
        m.created_at,
        m.sender_id,
        u.full_name AS sender_name,
        u.role AS sender_role
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ${id}
      ORDER BY m.created_at ASC
    `;

    await sql`
      UPDATE messages
      SET read_at = CURRENT_TIMESTAMP
      WHERE conversation_id = ${id}
        AND sender_id != ${req.currentUser.id}
        AND read_at IS NULL
    `;

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.log("Error in getMessages", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { id } = req.params;
  const { body, orderId } = req.body;

  if (!body?.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  try {
    const conversations = await sql`
      SELECT id, customer_id FROM conversations WHERE id = ${id} LIMIT 1
    `;

    if (conversations.length === 0) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const conversation = conversations[0];

    if (
      req.currentUser.role === "customer" &&
      conversation.customer_id !== req.currentUser.id
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await sql`
      INSERT INTO messages (conversation_id, sender_id, body, order_id)
      VALUES (${id}, ${req.currentUser.id}, ${body.trim()}, ${orderId || null})
      RETURNING id, conversation_id, sender_id, body, order_id, read_at, created_at
    `;

    await sql`
      UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ${id}
    `;

    const senderName = req.currentUser.full_name;

    if (req.currentUser.role === "admin") {
      await createNotification({
        userId: conversation.customer_id,
        type: "new_message",
        title: `Ergaa haaraa: ${senderName}`,
        body: body.trim().slice(0, 120),
        orderId: orderId || null,
      });
    } else {
      const { notifyAdmins } = await import("../lib/notificationHelper.js");
      await notifyAdmins({
        type: "new_message",
        title: `Ergaa haaraa: ${senderName}`,
        body: body.trim().slice(0, 120),
        orderId: orderId || null,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        ...messages[0],
        sender_name: senderName,
        sender_role: req.currentUser.role,
      },
    });
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
