import { NextFunction, Request, Response } from "express";
import { createField } from "../services/field";
import { AppError } from "../errors/AppError";

export const handleCreateField = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, price } = req.body;
    const field = await createField(name, description, price);
    res.status(201).json({
      status: "success",
      message: "create field success",
      data: {
        id: field.id,
        name: field.name,
        description: field.description,
        price: field.price,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AppError("Failed to create Field", 500));
  }
};
