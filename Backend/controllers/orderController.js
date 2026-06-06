import { sql } from "../config/db.js";

export const createOrder = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!req.currentUser || req.currentUser.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Only customers can place orders",
    });
  }

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product is required",
    });
  }

  const parsedQuantity = Number(quantity) || 1;

  if (parsedQuantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1",
    });
  }

  try {
    const products = await sql`
      SELECT id, name, price, image
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `;

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = products[0];
    const totalAmount = Number(product.price) * parsedQuantity;

    const orders = await sql`
      INSERT INTO orders (
        customer_id,
        product_id,
        quantity,
        status,
        total_amount
      )
      VALUES (
        ${req.currentUser.id},
        ${product.id},
        ${parsedQuantity},
        'Placed',
        ${totalAmount}
      )
      RETURNING id, customer_id, product_id, quantity, status, total_amount, created_at
    `;

    res.status(201).json({
      success: true,
      data: {
        ...orders[0],
        product_name: product.name,
        product_image: product.image,
      },
    });
  } catch (error) {
    console.log("Error in createOrder", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrders = async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    if (req.currentUser.role === "admin") {
      const orders = await sql`
        SELECT
          o.id,
          o.quantity,
          o.status,
          o.total_amount,
          o.created_at,
          p.id AS product_id,
          p.name AS product_name,
          p.image AS product_image,
          u.id AS customer_id,
          u.full_name AS customer_name,
          u.phone_number AS customer_phone
        FROM orders o
        JOIN products p ON p.id = o.product_id
        JOIN users u ON u.id = o.customer_id
        ORDER BY o.created_at DESC
      `;

      return res.status(200).json({
        success: true,
        data: orders,
      });
    }

    const orders = await sql`
      SELECT
        o.id,
        o.quantity,
        o.status,
        o.total_amount,
        o.created_at,
        p.id AS product_id,
        p.name AS product_name,
        p.image AS product_image
      FROM orders o
      JOIN products p ON p.id = o.product_id
      WHERE o.customer_id = ${req.currentUser.id}
      ORDER BY o.created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Error in getOrders", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!req.currentUser) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    // Check if order exists and if user has permission to delete
    const order = await sql`
      SELECT customer_id
      FROM orders
      WHERE id = ${id}
      LIMIT 1
    `;

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customers can only delete their own orders, admins can delete any order
    if (req.currentUser.role === "customer" && order[0].customer_id !== req.currentUser.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own orders",
      });
    }

    const deletedOrder = await sql`
      DELETE FROM orders
      WHERE id = ${id}
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      data: deletedOrder[0],
    });
  } catch (error) {
    console.log("Error in deleteOrder", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
