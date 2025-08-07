// controllers/admin-auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import HttpError from "../models/HttpError.js";
import { uploadToCloudinary } from "../upload.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const signup = async (req, res, next) => {
  const { email, password, role: incomingRole } = req.body;
  let avatar = null;
  if (req.file) {
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "users/avatars"
    );
    avatar = result.secure_url;
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(new HttpError("Admin already exists", 422));
    }

    const totalAdmins = await Admin.countDocuments();
    const role = totalAdmins === 0 ? "admin" : incomingRole || "staff";

    const hashedPw = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({ email, password: hashedPw, avatar, role });
    await newAdmin.save();

    const token = jwt.sign(
      { adminId: newAdmin.id, email, role: newAdmin.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      adminId: newAdmin._id.toString(),
      email,
      avatar: newAdmin.avatar,
      role,
    });
  } catch (err) {
    next(new HttpError("Sign up failed", 500));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(403)
        .json({ message: "Invalid username and password." });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res
        .status(403)
        .json({ message: "Invalid username and password." });
    }

    const token = jwt.sign(
      { adminId: admin.id, email, role: admin.role, avatar: admin.avatar },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      adminId: admin.id,
      email,
      role: admin.role,
      avatar: admin.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed." });
  }
};

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await Admin.find().select("-password");
    res.json({ users });
  } catch (err) {
    return next(new HttpError("Fetching admins failed.", 500));
  }
};

export const deleteUser = async (req, res, next) => {
  const { uid } = req.params;

  let user;
  try {
    user = await Admin.findById(uid);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted." });
  } catch (err) {
    next(new HttpError("Deleting user failed.", 500));
  }
};

export const updateUser = async (req, res, next) => {
  const { uid } = req.params;
  const { email, role } = req.body;
  let avatar = null;
  if (req.file) {
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "users/avatars"
    );
    avatar = result.secure_url;
  }

  let user;
  try {
    user = await Admin.findById(uid);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    if (email) user.email = email;
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: "User updated successfully.",
      admin: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    return next(new HttpError("User not found.", 404));
  }
};
