import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: String,
    address: String,
    paymentMethod: String,
    cartItems: [
      {
        name: { type: String, required: true },
        productId: String,
        quantity: { type: Number, default: 1 },
        imageUrl: { type: String, required: true },
      },
    ],
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
