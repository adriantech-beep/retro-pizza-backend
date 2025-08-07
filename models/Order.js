// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: String,
    address: String,
    paymentMethod: String,
    cartItems: [
      {
        productId: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
