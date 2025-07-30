import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  restoreProduct,
  softDeleteProduct,
  getTrashedProducts,
} from "../controllers/product-controllers.js";
import upload from "../upload.js";

const router = express.Router();

// GET all products
router.get("/", getProducts);

router.get("/trashed", getTrashedProducts);

router.post("/", upload.single("image"), createProduct);

router.delete("/:pid", deleteProduct);

router.patch("/:pid/soft-delete", softDeleteProduct);

router.patch("/:pid", upload.single("image"), updateProduct);

router.patch("/:pid/restore", restoreProduct);

//authentication

export default router;
