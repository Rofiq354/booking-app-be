import { Request, Response, NextFunction } from "express";
import { verifyToken, userPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: userPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  req.user = payload;
  next();
};
