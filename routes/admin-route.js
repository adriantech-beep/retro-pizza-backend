import express from "express";
import {
  signup,
  login,
  deleteUser,
  updateUser,
} from "../controllers/admin-auth.js";
import { getAllUsers } from "../controllers/admin-auth.js";
import uploadAvatar from "../uploadAvatar.js";
import { upload } from "../upload.js";

const router = express.Router();

router.post("/signup", uploadAvatar.single("avatar"), signup);

router.post("/login", login);

router.get("/", getAllUsers);

router.delete("/:uid", deleteUser);
router.patch("/:uid", upload.single("avatar"), updateUser);

export default router;
