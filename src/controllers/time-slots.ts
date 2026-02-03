import { Request, Response, NextFunction } from "express";
import { createTimeSlots, getFieldTimeSlots } from "../services/time-slot";
import { prisma } from "../prisma/client";
import { AppError } from "../errors/AppError";

export const createAndGetSlotsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fieldId, date, startHour, endHour } = req.body;

    if (!fieldId || !date || startHour === undefined || endHour === undefined) {
      return next(
        new AppError("fieldId, date, startHour, endHour are required", 400),
      );
    }

    const field = await prisma.field.findUnique({
      where: { id: Number(fieldId) },
    });
    if (!field) return next(new AppError("Field not found", 404));

    const slots = await createTimeSlots(
      fieldId,
      startHour,
      endHour,
      new Date(date),
    );

    res.status(200).json({
      status: "success",
      message: "Slots created and retrieved successfully",
      data: {
        id: field.id,
        name: field.name,
        price: field.price,
        slots,
      },
    });
  } catch (error) {
    next(new AppError("Failed to Create Slot", 500));
  }
};

export const getSlotsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const fieldId = Number(req.params.fieldId);
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) return next(new AppError("Field not found", 404));

    const slots = await getFieldTimeSlots(fieldId);

    res.status(200).json({
      status: "success",
      data: {
        id: field.id,
        name: field.name,
        price: field.price,
        slots,
      },
    });
  } catch (error) {
    next(new AppError("Failed to get Slot", 500));
  }
};
