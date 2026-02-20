import { prisma } from "../prisma/client";
import { AppError } from "../errors/AppError";

export const createTimeSlots = async (
  fieldId: number,
  startHour: number,
  endHour: number,
  date: Date,
) => {
  if (startHour >= endHour) {
    throw new AppError("startHour must be earlier than endHour", 400);
  }

  const slotsData = [];

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(hour + 1, 0, 0, 0);

    slotsData.push({ fieldId, startTime, endTime });
  }

  await prisma.timeSlot.createMany({
    data: slotsData,
    skipDuplicates: true,
  });

  const slots = await prisma.timeSlot.findMany({
    where: { fieldId },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      bookings: {
        select: { id: true, status: true, userId: true },
      },
    },
  });

  return slots.map((slot) => {
    const activeBooking = slot.bookings.find((b) => b.status !== "CANCELLED");

    return {
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      booked: !!activeBooking,
      bookingId: activeBooking?.id || null,
    };
  });
};

export const getFieldTimeSlots = async (fieldId: number) => {
  const slots = await prisma.timeSlot.findMany({
    where: { fieldId },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      bookings: { select: { id: true, status: true } },
    },
  });

  return slots.map((slot) => {
    const activeBooking = slot.bookings.find((b) => b.status !== "CANCELLED");

    return {
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      booked: !!activeBooking,
      bookingId: activeBooking?.id || null,
    };
  });
};
