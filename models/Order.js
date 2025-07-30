// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    contact: String,
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        imageUrl: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: Number,
    notes: String,
    receiptImage: String, // Image uploaded to Cloudinary (optional)
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
