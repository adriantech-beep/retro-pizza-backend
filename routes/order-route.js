import express from "express";
import {
  createOrder,
  getOrders,
  updateOrder,
} from "../controllers/order-controllers.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-orders", getOrders);
router.patch("/update-order/:id", updateOrder);

export default router;
