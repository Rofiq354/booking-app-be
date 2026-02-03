import { prisma } from "../prisma/client";
import { AppError } from "../errors/AppError";

export const createTimeSlots = async (
  fieldId: number,
  startHour: number,
  endHour: number,
  date: Date,
) => {
  //Validasi jam operasional
  if (startHour >= endHour) {
    throw new AppError("startHour must be earlier than endHour", 400);
  }

  const slotsData = [];
  // Loop untuk generate data slot per jam
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

  // Ambil semua slot (lama + baru)
  const slots = await prisma.timeSlot.findMany({
    where: { fieldId },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      booking: {
        select: { id: true, status: true, userId: true },
      },
    },
  });

  return slots.map((slot) => ({
    id: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    booked: slot.booking ? true : false,
    bookingId: slot.booking?.id || null,
  }));
};

export const getFieldTimeSlots = async (fieldId: number) => {
  const slots = await prisma.timeSlot.findMany({
    where: { fieldId },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      booking: { select: { id: true } },
    },
  });

  return slots.map((slot) => ({
    id: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    booked: slot.booking ? true : false,
    bookingId: slot.booking?.id || null,
  }));
};
