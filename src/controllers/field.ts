import { NextFunction, Request, Response } from "express";
import { createField, editField } from "../services/field";
import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";
import cloudinary from "../utils/cloudinary";

export const handleCreateField = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, price } = req.body;
    let imageUrl: string | null = null;
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "fields" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          },
        );
        uploadStream.end(req.file!.buffer);
      });
      imageUrl = (await uploadPromise) as string;
    }
    const field = await createField(name, description, Number(price), imageUrl);
    res.status(201).json({
      status: "success",
      message: "create field success",
      data: field,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to Create Field", 500));
    }
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        slots: true,
      },
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
    if (isNaN(id)) return next(new AppError("Invalid Field id", 400));

    const existingField = await prisma.field.findUnique({ where: { id } });
    if (!existingField) return next(new AppError("Field not found", 404));

    const { name, description, price } = req.body;

    let imageUrl = existingField.image;

    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "fields" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          },
        );
        uploadStream.end(req.file!.buffer);
      });

      imageUrl = (await uploadPromise) as string;
    }

    const edit = await editField(
      id,
      name,
      description ?? null,
      price,
      imageUrl,
    );

    res.status(200).json({
      status: "success",
      message: "Edit Field Successful",
      data: edit,
    });
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("Failed to Edit Field", 500),
    );
  }
};

export const deleteField = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const deletefield = await prisma.field.delete({
      where: { id },
    });
    res.status(200).json({
      status: "success",
      message: "Field successfully deleted",
    });
  } catch (error) {
    console.error(error);
    next(new AppError("failed to delete field", 500));
  }
};
