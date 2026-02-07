import { AppError } from "../errors/AppError";
import { prisma } from "../prisma/client";

export const bookingField = async (
  userId: number,
  fieldId: number,
  slotId: number,
) => {
  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
  if (!slot) throw new AppError("Slot not found", 404);

  const existingBooking = await prisma.booking.findUnique({
    where: { slotId },
  });
  if (existingBooking) throw new AppError("Slot already booked", 400);

  const createBooking = prisma.booking.create({
    data: { userId, fieldId, slotId },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      field: {
        select: { id: true, name: true, description: true, price: true },
      },
      slot: { select: { id: true, startTime: true, endTime: true } },
    },
  });
  return createBooking;
};

export const handleApproveBooking = async (bookingId: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "PENDING") {
    throw new AppError("Pending cancellation or already approved", 400);
  }

  const approveBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
    },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      field: {
        select: { id: true, name: true, description: true, price: true },
      },
      slot: { select: { id: true, startTime: true, endTime: true } },
    },
  });
  return approveBooking;
};

export const handleCancelBooking = async (bookingId: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "PENDING") {
    throw new AppError("Pending cancellation or already approved", 400);
  }

  const cancelBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
    },
  });
  return cancelBooking;
};
