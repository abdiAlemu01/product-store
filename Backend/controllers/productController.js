import { sql } from "../config/db.js";
import { sendSMS } from "../lib/smsService.js";
export const getProducts =async(req,res)=>{
    try {
        const products = await sql`SELECT * FROM products
        ORDER BY created_at DESC`;
        console.log("Fetched products",products)
        res.status(200).json({success:true, data:products})

    } catch (error) {
        console.log("Error in function fetching products",error)
        res.status(500).json({success:false,message :"server error"})
    }
}
export const createProduct = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "Please provide name and price"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please provide an image"
    });
  }

  try {
    // Cloudinary returns the full CDN URL in req.file.path
    const imageUrl = req.file.path;

    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES(${name}, ${price}, ${imageUrl})
      RETURNING *
    `;

    // Get all customers to send SMS notification
    const customers = await sql`
      SELECT phone_number, full_name
      FROM users
      WHERE role = 'customer'
    `;

    // Send SMS notification to all customers
    const smsMessage = `🆕 NEW PRODUCT ALERT!\n\n${name}\nPrice: $${price}\n\nCheck it out now on our store!\n\nThank you for being our valued customer!`;

    for (const customer of customers) {
      await sendSMS(customer.phone_number, smsMessage);
    }

    res.status(200).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Error in create product function:", error?.message || error);
    if (error?.http_code) {
      console.error("Cloudinary HTTP error:", error.http_code, error.message);
    }
    res.status(500).json({ success: false, message: error?.message || "Server error happened" });
  }
};
export const getProduct =async(req,res)=>{
    const {id}=req.params;
    try {
        
        const product=await sql`SELECT * FROM products WHERE id=${id}`;
        if(product.length ===0){
            return res.status(404).json({success:false,message:"product is not found"})
        }
        res.status(200).json({success:true,data:product[0]})
    } catch (error) {
        console.error("Error while selecting product:", error);
        return { error: "Database error while fetching product" };
        
    }

}

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required"
      });
    }

    let image;

    // If a new file was uploaded, Cloudinary returns full CDN URL in req.file.path
    if (req.file) {
      image = req.file.path;
    } else {
      // Keep the existing image if no new file uploaded
      const existingProduct = await sql`
        SELECT image FROM products WHERE id = ${id} LIMIT 1
      `;
      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
      image = existingProduct[0].image;
    }

    // Update query
    const updateProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *;
    `;

    // If no product found
    if (updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Success
    res.status(200).json({
      success: true,
      data: updateProduct[0]
    });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct =async(req,res)=>{
    const {id}=req.params;
    try {
        const deleteProduct=await sql`DELETE FROM products WHERE id=${id} RETURNING *`;
        if(deleteProduct.length ===0){
            return res.status(404).json({success:false,message:"product not found"})
        }
        res.status(200).json({success:true,data:deleteProduct[0]})
    } catch (error) {
        console.log("Error in delete product function",error)
        res.status(500).json({success:false,message:"server error happened"})
        
    }

}