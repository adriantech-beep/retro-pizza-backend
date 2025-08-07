import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import HttpError from "../models/HttpError.js";

export const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { customerName, phone, address, paymentMethod, cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return next(new HttpError("Cart is empty.", 422));
  }

  try {
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== cartItems.length) {
      return next(
        new HttpError("Some products in the cart do not exist.", 404)
      );
    }

    const newOrder = new Order({
      customerName,
      phone,
      address,
      paymentMethod,
      cartItems,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Placing order failed, please try again.", 500));
  }
};
