import { NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";

export const createField = async (
  name: string,
  description: string | null,
  price: number,
) => {
  const existingField = await prisma.field.findUnique({
    where: { name },
  });
  if (existingField) {
    throw new AppError("The field name is already available.", 409);
  }
  const field = await prisma.field.create({
    data: {
      name,
      description,
      price,
    },
  });
  return {
    id: field.id,
    name: field.name,
    description: field.description,
    price: field.price,
    created_at: field.createdAt,
    updated_at: field.updatedAt,
  };
};

export const editField = async (
  id: number,
  name: string,
  description: string | null,
  price: number,
) => {
  const field = await prisma.field.findUnique({
    where: { id },
  });

  if (!field) throw new AppError("field not found", 404);

  const editField = await prisma.field.update({
    where: { id },
    data: {
      name,
      description,
      price,
    },
  });

  return {
    id: editField.id,
    name: editField.name,
    description: editField.description,
    price: editField.price,
  };
};
