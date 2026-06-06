import { sql } from "../config/db.js";

export const getCustomerByPhone = async (req, res) => {
  const phoneNumber = req.query.phoneNumber?.trim();

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  try {
    const customers = await sql`
      SELECT id, full_name, phone_number, role, created_at
      FROM users
      WHERE phone_number = ${phoneNumber}
      AND role = 'customer'
      LIMIT 1
    `;

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customer = customers[0];

    const promotions = await sql`
      SELECT id, title, message, discount_percent, created_at
      FROM promotions
      WHERE phone_number = ${phoneNumber}
      ORDER BY created_at DESC
    `;

    const orderSummary = await sql`
      SELECT COUNT(*)::int AS total_orders
      FROM orders
      WHERE customer_id = ${customer.id}
    `;

    res.status(200).json({
      success: true,
      data: {
        customer,
        promotions,
        totalOrders: orderSummary[0]?.total_orders || 0,
      },
    });
  } catch (error) {
    console.log("Error in getCustomerByPhone", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createPromotion = async (req, res) => {
  const { phoneNumber, title, message, discountPercent } = req.body;

  if (!phoneNumber?.trim() || !title?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Phone number and promotion title are required",
    });
  }

  try {
    const customers = await sql`
      SELECT id, phone_number
      FROM users
      WHERE phone_number = ${phoneNumber.trim()}
      AND role = 'customer'
      LIMIT 1
    `;

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found for this phone number",
      });
    }

    const promotions = await sql`
      INSERT INTO promotions (
        customer_id,
        phone_number,
        title,
        message,
        discount_percent,
        created_by
      )
      VALUES (
        ${customers[0].id},
        ${customers[0].phone_number},
        ${title.trim()},
        ${message?.trim() || ""},
        ${discountPercent || 0},
        ${req.currentUser.id}
      )
      RETURNING id, customer_id, phone_number, title, message, discount_percent, created_at
    `;

    res.status(201).json({
      success: true,
      data: promotions[0],
    });
  } catch (error) {
    console.log("Error in createPromotion", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
