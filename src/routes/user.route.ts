import { Router } from "express";
import {
  getUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller";
import { auth } from "../middlewares/auth";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/", auth, getUsers);

export default router;
