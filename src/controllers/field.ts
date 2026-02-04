import { NextFunction, Request, Response } from "express";
import { createField, editField } from "../services/field";
import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";

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

export const getAllField = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const field = await prisma.field.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, description: true, price: true },
    });
    res.status(200).json({
      status: "success",
      message: "Get all Field",
      data: field,
    });
  } catch (error) {
    next(new AppError("Failed to display all fields", 500));
  }
};

export const updateField = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new AppError("Invalid Field id", 401));
    }

    const { name, description, price } = req.body;
    if (!name || price === undefined) {
      return next(new AppError("name and price are required", 400));
    }

    const edit = await editField(id, name, description ?? null, price);

    res.status(200).json({
      status: "success",
      message: "Edit Field Successfull",
      data: edit,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error(error);
      next(new AppError("Failed to Edit Field", 500));
    }
  }
};
