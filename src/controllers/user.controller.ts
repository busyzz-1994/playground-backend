import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../schemas/user.schema";
import {
  createUser,
  findUserByEmail,
  getUserList,
  verifyUserPassword,
} from "../services/user.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 1. 校验入参
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ code: 400, message: "参数校验失败", errors });
      return;
    }

    // 2. 检查邮箱是否已注册
    const existing = await findUserByEmail(result.data.email);
    if (existing) {
      res.status(409).json({ code: 409, message: "该邮箱已被注册" });
      return;
    }

    // 3. 创建用户
    const user = await createUser(result.data);
    res.status(201).json({ code: 201, message: "注册成功", data: user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. 校验入参
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ code: 400, message: "参数校验失败", errors });
      return;
    }

    // 2. 验证账号密码
    const user = await verifyUserPassword(result.data);
    if (!user) {
      res.status(401).json({ code: 401, message: "邮箱或密码错误" });
      return;
    }

    // 3. 签发 JWT 并写入 HttpOnly Cookie
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN ||
          "7d") as jwt.SignOptions["expiresIn"],
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天，单位毫秒
    });

    res.json({ code: 200, message: "登录成功", data: user });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ code: 200, message: "已退出登录" });
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(req.query.pageSize as string) || 10),
    );
    const data = await getUserList(page, pageSize);
    res.json({ code: 200, message: "ok", data });
  } catch (err) {
    next(err);
  }
}
