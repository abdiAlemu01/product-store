// routes/userRoutes.js
import express from "express";
import {getProducts,getProduct, createProduct,deleteProduct,updateProduct} from "../controllers/productController.js"
import upload from "../middleware/upload.js";

const router = express.Router();

// Example route
router.get("/",getProducts);
router.post("/", upload.single("image"), createProduct);
router.get("/:id",getProduct);
router.delete("/:id",deleteProduct);
router.put("/:id", upload.single("image"), updateProduct);

export default router;
