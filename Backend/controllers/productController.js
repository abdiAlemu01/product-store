import { sql } from "../config/db.js"
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
    // Create image URL path
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const newProduct = await sql`
      INSERT INTO products (name, price, image) 
      VALUES(${name}, ${price}, ${imageUrl}) 
      RETURNING *
    `;
    
    res.status(200).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error in create product function", error);
    res.status(500).json({ success: false, message: "Server error happened" });
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
  const { name, price, imageUrl } = req.body;

  try {
    if (!name || !price) {
      return res.status(400).json({ 
        success: false,
        message: "Name and price are required" 
      });
    }

    let image;
    
    // If a new file was uploaded, use it
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } 
    // If no new file but imageUrl exists (keeping old image)
    else if (imageUrl) {
      image = imageUrl;
    } 
    // No image provided at all
    else {
      return res.status(400).json({ 
        success: false,
        message: "Image is required" 
      });
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