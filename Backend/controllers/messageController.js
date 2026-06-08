import { sql } from "../config/db.js";

export const sendMessage = async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name, phone, and message are required",
    });
  }

  try {
    const newMessage = await sql`
      INSERT INTO contact_messages (name, phone, message)
      VALUES (${name.trim()}, ${phone.trim()}, ${message.trim()})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newMessage[0],
    });
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await sql`
      SELECT * FROM contact_messages
      ORDER BY created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log("Error in getMessages", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await sql`
      DELETE FROM contact_messages
      WHERE id = ${id}
    `;

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteMessage", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
