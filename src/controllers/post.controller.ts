import { NextFunction, Request, Response } from "express";
import { createPostSchema, updatePostSchema } from "../schemas/post.schema";
import {
  createPost,
  deletePost,
  getPostById,
  getPostList,
  updatePost,
} from "../services/post.service";

export async function createPostHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = createPostSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ code: 400, message: "参数校验失败", errors });
      return;
    }

    // userId 由 auth 中间件注入到 req.user
    const userId = (req as any).user.userId as number;
    const post = await createPost(userId, result.data);
    res.status(201).json({ code: 201, message: "发布成功", data: post });
  } catch (err) {
    next(err);
  }
}

export async function getPostsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt((req.query.pageSize as string) || "10", 10)),
    );
    const data = await getPostList(page, pageSize);
    res.json({ code: 200, message: "ok", data });
  } catch (err) {
    next(err);
  }
}

export async function getPostByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      res.status(400).json({ code: 400, message: "无效的文章 ID" });
      return;
    }
    const post = await getPostById(postId);
    if (!post) {
      res.status(404).json({ code: 404, message: "文章不存在" });
      return;
    }
    res.json({ code: 200, message: "ok", data: post });
  } catch (err) {
    next(err);
  }
}

export async function deletePostHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      res.status(400).json({ code: 400, message: "无效的文章 ID" });
      return;
    }
    const userId = (req as any).user.userId as number;
    const result = await deletePost(postId, userId);
    if (result === "not_found") {
      res.status(404).json({ code: 404, message: "文章不存在" });
      return;
    }
    if (result === "forbidden") {
      res.status(403).json({ code: 403, message: "无权操作" });
      return;
    }
    res.json({ code: 200, message: "删除成功" });
  } catch (err) {
    next(err);
  }
}

export async function updatePostHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      res.status(400).json({ code: 400, message: "无效的文章 ID" });
      return;
    }
    const result = updatePostSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ code: 400, message: "参数校验失败", errors });
      return;
    }
    const userId = (req as any).user.userId as number;
    const post = await updatePost(postId, userId, result.data);
    if (post === "not_found") {
      res.status(404).json({ code: 404, message: "文章不存在" });
      return;
    }
    if (post === "forbidden") {
      res.status(403).json({ code: 403, message: "无权操作" });
      return;
    }
    res.json({ code: 200, message: "更新成功", data: post });
  } catch (err) {
    next(err);
  }
}
