import express from "express";
import { loginUser, registerCustomer } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-customer", registerCustomer);
router.post("/login", loginUser);

export default router;
