// routes/userRoutes.js
import express from "express";
import {getProducts,getProduct, createProduct,deleteProduct,updateProduct} from "../controllers/productController.js"
const router = express.Router();

// Example route
router.get("/",getProducts);
router.post("/",createProduct);
router.get("/:id",getProduct);
router.delete("/:id",deleteProduct);
router.put("/:id",updateProduct);

export default router;
