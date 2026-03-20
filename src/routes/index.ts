import { Router } from "express";
import userRouter from "./user.route";
import postRouter from "./post.route";

const router: Router = Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;
