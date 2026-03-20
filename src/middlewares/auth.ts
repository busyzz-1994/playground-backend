import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
}

// 扩展 Express Request，携带解析后的用户信息
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ code: 401, message: "未登录或登录已过期" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ code: 401, message: "未登录或登录已过期" });
  }
}
