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
    throw new AppError("The field name is already available.", 400);
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
