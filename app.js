import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import productRoutes from "./routes/products-route.js";
import adminAuthRoutes from "./routes/admin-route.js";
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(import.meta.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes
app.use("/api/products", productRoutes);

//API auth
app.use("/api/users", adminAuthRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

//error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
