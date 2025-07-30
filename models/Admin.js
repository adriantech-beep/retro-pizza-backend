import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["admin", "staff", "moderator"],
    default: "staff",
  },
});

export default mongoose.model("Admin", adminSchema);
