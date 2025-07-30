// models/Product.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String },
  isAvailable: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("Product", productSchema);
