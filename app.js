import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/products-route.js";
import adminAuthRoutes from "./routes/admin-route.js";
import customerAuthRoutes from "./routes/customer-route.js";
import orderRoutes from "./routes/order-route.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://retro-pizza-main.vercel.app",
  "https://retro-pizza-main-git-main-adriantech-beeps-projects.vercel.app",
  "https://retro-pizza-main-geqfyy1f6-adriantech-beeps-projects.vercel.app",
  "https://retro-pizza-admin.vercel.app",
  "https://retro-pizza-admin-git-main-adriantech-beeps-projects.vercel.app",
  "https://retro-pizza-admin-irbg7824h-adriantech-beeps-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        console.log("Blocked by CORS: ", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", adminAuthRoutes);
app.use("/api/customers", customerAuthRoutes);
app.use("/api/orders", orderRoutes);

// Error handler
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred!",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
