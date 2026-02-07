import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { Role } from "@prisma/client";

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== Role.USER) {
    return res.status(400).json({ message: "Forbidden" });
  }
  next();
};
