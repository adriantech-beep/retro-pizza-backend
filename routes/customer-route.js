import express from "express";
import {
  getCurrentCustomer,
  login,
  signup,
} from "../controllers/customer-auth.js";
import checkCustomerAuth from "../models/CheckCustomerAuth.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/log-in", login);
router.get("/customer", checkCustomerAuth, getCurrentCustomer);

export default router;
