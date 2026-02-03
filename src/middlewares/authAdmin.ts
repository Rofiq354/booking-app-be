import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { Role } from "@prisma/client";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return res.status(400).json({ message: "Forbidden" });
  }
  next();
};
