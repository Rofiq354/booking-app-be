import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface userPayload {
  id: number;
  role: Role;
}

export function signToken(payload: userPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): userPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as userPayload;
  } catch (error) {
    return null;
  }
}
