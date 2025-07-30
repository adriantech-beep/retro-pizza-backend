// middleware/uploadAvatar.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users/avatars", // <– separate folder
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadAvatar;
