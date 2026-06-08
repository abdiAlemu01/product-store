import { sql } from "../config/db.js";
import { createNotification, notifyAdmins } from "../lib/notificationHelper.js";

const formatOrderRow = (row) => ({
  ...row,
  product_name: row.product_name || row.custom_product_name,
  is_custom: Boolean(row.is_custom),
});

export const createOrder = async (req, res) => {
  const { productId, customProductName, quantity = 1 } = req.body;

  if (!req.currentUser || req.currentUser.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Only customers can place orders",
    });
  }

  const parsedQuantity = Number(quantity) || 1;

  if (parsedQuantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1",
    });
  }

  const isCustom = !productId && customProductName?.trim();

  if (!productId && !isCustom) {
    return res.status(400).json({
      success: false,
      message: "Product or custom product name is required",
    });
  }

  try {
    if (isCustom) {
      const orders = await sql`
        INSERT INTO orders (
          customer_id,
          product_id,
          custom_product_name,
          is_custom,
          quantity,
          status,
          total_amount
        )
        VALUES (
          ${req.currentUser.id},
          NULL,
          ${customProductName.trim()},
          TRUE,
          ${parsedQuantity},
          'Placed',
          0
        )
        RETURNING id, customer_id, product_id, custom_product_name, is_custom,
                  quantity, status, total_amount, created_at
      `;

      const order = formatOrderRow({
        ...orders[0],
        product_name: customProductName.trim(),
        product_image: null,
      });

      await notifyAdmins({
        type: "order_placed",
        title: "Ajaja addaa haaraa",
        body: `${req.currentUser.full_name} "${customProductName.trim()}" ajaje (Baay'ina: ${parsedQuantity})`,
        orderId: order.id,
      });

      return res.status(201).json({ success: true, data: order });
    }

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
        total_amount,
        is_custom
      )
      VALUES (
        ${req.currentUser.id},
        ${product.id},
        ${parsedQuantity},
        'Placed',
        ${totalAmount},
        FALSE
      )
      RETURNING id, customer_id, product_id, quantity, status, total_amount,
                is_custom, created_at
    `;

    const order = formatOrderRow({
      ...orders[0],
      product_name: product.name,
      product_image: product.image,
    });

    await notifyAdmins({
      type: "order_placed",
      title: "Ajaja haaraa argame",
      body: `${req.currentUser.full_name} "${product.name}" ajaje (Baay'ina: ${parsedQuantity})`,
      orderId: order.id,
    });

    res.status(201).json({ success: true, data: order });
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
          o.is_custom,
          o.custom_product_name,
          o.rejection_reason,
          o.reviewed_at,
          p.id AS product_id,
          COALESCE(p.name, o.custom_product_name) AS product_name,
          p.image AS product_image,
          u.id AS customer_id,
          u.full_name AS customer_name,
          u.phone_number AS customer_phone
        FROM orders o
        LEFT JOIN products p ON p.id = o.product_id
        JOIN users u ON u.id = o.customer_id
        ORDER BY o.created_at DESC
      `;

      return res.status(200).json({
        success: true,
        data: orders.map(formatOrderRow),
      });
    }

    const orders = await sql`
      SELECT
        o.id,
        o.quantity,
        o.status,
        o.total_amount,
        o.created_at,
        o.is_custom,
        o.custom_product_name,
        o.rejection_reason,
        o.reviewed_at,
        p.id AS product_id,
        COALESCE(p.name, o.custom_product_name) AS product_name,
        p.image AS product_image
      FROM orders o
      LEFT JOIN products p ON p.id = o.product_id
      WHERE o.customer_id = ${req.currentUser.id}
      ORDER BY o.created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: orders.map(formatOrderRow),
    });
  } catch (error) {
    console.log("Error in getOrders", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  if (req.currentUser.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  const allowedStatuses = ["Accepted", "Rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be Accepted or Rejected",
    });
  }

  if (status === "Rejected" && !rejectionReason?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Rejection reason is required",
    });
  }

  try {
    const existing = await sql`
      SELECT o.id, o.customer_id, o.status,
             COALESCE(p.name, o.custom_product_name) AS product_name
      FROM orders o
      LEFT JOIN products p ON p.id = o.product_id
      WHERE o.id = ${id}
      LIMIT 1
    `;

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (existing[0].status !== "Placed") {
      return res.status(400).json({
        success: false,
        message: `Order is already ${existing[0].status}`,
      });
    }

    const updated = await sql`
      UPDATE orders
      SET
        status = ${status},
        rejection_reason = ${status === "Rejected" ? rejectionReason.trim() : null},
        reviewed_at = CURRENT_TIMESTAMP,
        reviewed_by = ${req.currentUser.id}
      WHERE id = ${id}
      RETURNING id, customer_id, quantity, status, rejection_reason, reviewed_at, is_custom, custom_product_name
    `;

    const productName = existing[0].product_name;
    const isAccepted = status === "Accepted";

    await createNotification({
      userId: existing[0].customer_id,
      type: isAccepted ? "order_accepted" : "order_rejected",
      title: isAccepted ? "Ajajni kee fudhatameera" : "Ajajni kee didameera",
      body: isAccepted
        ? `"${productName}" ajajni kee fudhatameera.`
        : `"${productName}" ajajni kee didameera: ${rejectionReason.trim()}`,
      orderId: Number(id),
    });

    res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.log("Error in updateOrderStatus", error);
    res.status(500).json({ success: false, message: "Server error" });
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
