import { sql } from "../config/db.js";
import bcrypt from "bcrypt";

const buildUsername = (fullName, phoneNumber) => {
  const normalizedName = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const normalizedPhone = phoneNumber.replace(/\D/g, "").slice(-4) || "user";
  return `${normalizedName || "customer"}-${normalizedPhone}`;
};

export const registerCustomer = async (req, res) => {
  const { fullName, phoneNumber, password } = req.body;

  if (!fullName?.trim() || !phoneNumber?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Full name, phone number, and password are required",
    });
  }

  try {
    const trimmedName = fullName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedPassword = password.trim();

    const existingUser = await sql`
      SELECT id, role
      FROM users
      WHERE phone_number = ${trimmedPhone}
      LIMIT 1
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A user with this phone number already exists",
      });
    }

    const username = buildUsername(trimmedName, trimmedPhone);
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const createdUsers = await sql`
      INSERT INTO users (username, full_name, phone_number, password, role)
      VALUES (${username}, ${trimmedName}, ${trimmedPhone}, ${hashedPassword}, 'customer')
      RETURNING id, full_name, phone_number, role, created_at
    `;

    res.status(201).json({
      success: true,
      data: createdUsers[0],
    });
  } catch (error) {
    console.log("Error in registerCustomer", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Phone number and password are required",
    });
  }

  try {
    const users = await sql`
      SELECT id, full_name, phone_number, password, role, created_at
      FROM users
      WHERE phone_number = ${phoneNumber.trim()}
      LIMIT 1
    `;

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found for this phone number",
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.log("Error in loginUser", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
