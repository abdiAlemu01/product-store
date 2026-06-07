// routes/productRoutes.js
import express from "express";
import { getProducts, getProduct, createProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
import upload from "../middleware/upload.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Wrapper that catches multer/Cloudinary errors and returns a clean JSON response
// (Without this, multer errors crash with [object Object] and a 500 with no message)
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload/Cloudinary error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
        detail: err.http_code
          ? `Cloudinary error ${err.http_code}: check your CLOUDINARY credentials in .env`
          : undefined,
      });
    }
    next();
  });
};

router.get("/", getProducts);
router.post("/", requireAdmin, handleUpload, createProduct);
router.get("/:id", getProduct);
router.delete("/:id", requireAdmin, deleteProduct);
router.put("/:id", requireAdmin, handleUpload, updateProduct);

export default router;
