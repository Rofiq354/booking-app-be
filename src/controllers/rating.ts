import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { AppError } from "../errors/AppError";

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError("Rating must be between 1 and 5", 400));
    }

    // Cari Booking & Validasi (Milik User & Status CONFIRMED)
    const booking = await prisma.booking.findFirst({
      where: {
        id: Number(bookingId),
        userId: Number(userId),
        status: "CONFIRMED",
      },
      include: { review: true },
    });

    if (!booking) {
      return next(new AppError("Booking not found or not yet confirmed", 404));
    }

    // Cek apakah booking ini sudah pernah di-review
    if (booking.review) {
      return next(new AppError("This booking has already been reviewed", 400));
    }

    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId: Number(userId),
        fieldId: booking.fieldId,
        bookingId: booking.id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Thank you for your review!",
      data: newReview,
    });
  } catch (error) {
    console.error(error);
    next(new AppError("Internal Server Error", 500));
  }
};
