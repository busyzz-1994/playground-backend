import { Router } from "express";
import {
  createPostHandler,
  deletePostHandler,
  getPostByIdHandler,
  getPostsHandler,
  updatePostHandler,
} from "../controllers/post.controller";
import { auth } from "../middlewares/auth";

const router: Router = Router();

router.get("/", auth, getPostsHandler);
router.post("/", auth, createPostHandler);
router.get("/:id", auth, getPostByIdHandler);
router.patch("/:id", auth, updatePostHandler);
router.delete("/:id", auth, deletePostHandler);

export default router;
