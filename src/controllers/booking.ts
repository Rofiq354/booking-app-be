import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { bookingField } from "../services/booking";
import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";

export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { fieldId, slotId } = req.body;

    const booking = await bookingField(userId, fieldId, slotId);
    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to booking field", 500));
    }
  }
};

export const getAllBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allBooking = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        field: { select: { name: true, price: true } },
        slot: { select: { startTime: true, endTime: true } },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Get All Booking User",
      data: allBooking,
    });
  } catch (error) {
    next(new AppError("Failed to get All Booking", 500));
  }
};
