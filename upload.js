import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "@cloudinary/multer-storage-cloudinary";

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "retro-pizza", // folder in your Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

export default upload;
