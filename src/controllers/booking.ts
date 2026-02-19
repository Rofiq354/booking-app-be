import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  bookingField,
  handleApproveBooking,
  handleCancelBooking,
} from "../services/booking";
import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";
import { sendEmail } from "../utils/email";

export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { fieldId, slotId } = req.body;

    const booking = await bookingField(userId, fieldId, slotId);

    try {
      await sendEmail(
        booking.user.email,
        booking.field.name,
        booking.slot.startTime,
        booking.slot.endTime,
        booking.field.price,
      );
    } catch (error) {
      console.error("Email gagal dikirim:", error);
    }

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

export const approveBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = Number(req.params.id);

    const accBooking = await handleApproveBooking(bookingId);

    res.status(200).json({
      status: "success",
      meesage: "Booking approve successfuly",
      data: accBooking,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to approve booking", 500));
    }
  }
};

export const rejectBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = Number(req.params.id);

    const cancelBooking = await handleCancelBooking(bookingId);

    res.status(200).json({
      status: "success",
      message: "Cancel booking successfuly",
      data: cancelBooking,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to cancel booking", 500));
    }
  }
};

export const getUserBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid user id",
    });
  }
  try {
    const userBooking = await prisma.booking.findMany({
      where: { user: { id: userId } },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        field: {
          select: {
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Get User Booking Successfully",
      data: userBooking,
    });
  } catch (error) {
    next(new AppError("Failed to get User Booking", 500));
  }
};

export const userCancelBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const bookingId = Number(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new AppError("Booking not found", 400);
    }

    if (booking.userId !== userId) {
      throw new AppError("You cannot cancel this booking.", 403);
    }

    if (booking.status === "CONFIRMED") {
      throw new AppError("Confirmed bookings cannot be cancelled.", 400);
    }

    if (booking.status === "CANCELLED") {
      throw new AppError("booking has been cancelled.", 400);
    }

    const cancel = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
      data: cancel,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to cancel booking", 500));
    }
  }
};

export const getAllUserPending = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.booking.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { name: true, email: true } },
        field: { select: { name: true, price: true } },
        slot: { select: { startTime: true, endTime: true } },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Get All User Booking Pending",
      data: user,
    });
  } catch (error) {
    next(new AppError("Failed to get Pending User", 500));
  }
};
