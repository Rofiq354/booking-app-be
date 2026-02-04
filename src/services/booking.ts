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

  return prisma.booking.create({
    data: { userId, fieldId, slotId },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      field: {
        select: { id: true, name: true, description: true, price: true },
      },
      slot: { select: { id: true, startTime: true, endTime: true } },
    },
  });
};
