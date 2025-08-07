import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import HttpError from "../models/HttpError.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const signup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return next(new HttpError("Email already exists", 422));
    }

    if (password !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 422));
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const newCustomer = new Customer({
      email,
      password: hashedPw,
    });
    await newCustomer.save();

    const token = jwt.sign({ customerId: newCustomer._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      customerId: newCustomer._id.toString(),
      email,
    });
  } catch (err) {
    next(new HttpError("Sign up failed", 500));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (!existingCustomer) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const isValid = await bcrypt.compare(password, existingCustomer.password);
    if (!isValid) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const token = jwt.sign({ customerId: existingCustomer._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      customerId: existingCustomer._id.toString(),
      email: existingCustomer.email,
    });
  } catch (err) {
    next(new HttpError("Login failed", 500));
  }
};

export const getCurrentCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customerId).select(
      "-password"
    );
    if (!customer) {
      return next(new HttpError("Customer not found", 404));
    }

    res.status(200).json({ customer });
  } catch (err) {
    return next(new HttpError("Fetching customer failed", 500));
  }
};
