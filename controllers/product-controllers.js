import { validationResult } from "express-validator";
import HttpError from "../models/HttpError.js";
import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isDeleted: false });

    const formatted = products.map((prod) => prod.toObject({ getters: true }));

    res.status(200).json({ products: formatted });
  } catch (err) {
    res.status(500).json({ message: "Fetching products failed." });
  }
};

export const getTrashedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isDeleted: true });

    const transformedProducts = products.map((product) =>
      product.toObject({ getters: true })
    );

    res.status(200).json({ products: transformedProducts });
  } catch (err) {
    next(new HttpError("Fetching trashed products failed", 500));
  }
};

export const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, description, price, category } = req.body;
  const imageUrl = req.file?.path;

  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return next(
        new HttpError(
          "Product name already exists. Please choose a different name.",
          422
        )
      );
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    return next(new HttpError("Creating product failed.", 500));
  }
};

export const updateProduct = async (req, res, next) => {
  const productId = req.params.pid;
  const { name, description, category, price } = req.body;
  const imageUrl = req?.file?.path;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpError("Could not find product for this id", 404));
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully.",
      products: {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Editing product failed.", 500));
  }
};

export const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
    if (!product) {
      return next(new HttpError("Could not find product for this id", 404));
    }
  } catch (err) {
    return next(
      new HttpError("Something went wrong,could not delete product", 500)
    );
  }

  try {
    await product.deleteOne();
  } catch (err) {
    return next(
      new HttpError("Something went wrong,could not delete product", 500)
    );
  }

  res.status(200).json({ message: "Deleted product" });
};

export const softDeleteProduct = async (req, res, next) => {
  const productId = req.params.pid;
  try {
    const product = await Product.findById(productId);
    if (!product) return next(new HttpError("Product not found", 404));

    product.isDeleted = true;
    await product.save();
    res.status(200).json({ message: "Product soft deleted" });
  } catch (err) {
    next(new HttpError("Soft delete failed", 500));
  }
};

export const restoreProduct = async (req, res, next) => {
  const productId = req.params.pid;
  try {
    const product = await Product.findById(productId);
    if (!product || !product.isDeleted)
      return next(new HttpError("Cannot restore", 404));

    product.isDeleted = false;
    await product.save();
    res.status(200).json({ message: "Product restored" });
  } catch (err) {
    next(new HttpError("Restore failed", 500));
  }
};
