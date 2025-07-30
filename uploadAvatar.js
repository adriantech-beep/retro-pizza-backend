// middleware/uploadAvatar.js
import multer from "multer";

const storage = multer.memoryStorage(); // <-- change this
const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadAvatar;
