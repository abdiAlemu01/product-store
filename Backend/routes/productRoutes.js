// routes/userRoutes.js
import express from "express";
import {getProducts,getProduct, createProduct,deleteProduct,updateProduct} from "../controllers/productController.js"
import upload from "../middleware/upload.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Example route
router.get("/",getProducts);
router.post("/", requireAdmin, upload.single("image"), createProduct);
router.get("/:id",getProduct);
router.delete("/:id", requireAdmin, deleteProduct);
router.put("/:id", requireAdmin, upload.single("image"), updateProduct);

export default router;
