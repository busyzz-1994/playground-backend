import { Router } from "express";
import {
  getAvatarPresignedUrl,
  getMe,
  getUsers,
  login,
  logout,
  register,
  updateMe,
} from "../controllers/user.controller";
import { auth } from "../middlewares/auth";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);
router.patch("/me", auth, updateMe);
router.post("/me/avatar/presign", auth, getAvatarPresignedUrl);
router.get("/", auth, getUsers);

export default router;
