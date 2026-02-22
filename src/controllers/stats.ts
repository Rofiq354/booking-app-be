import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";

export const getHeroStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Hitung Total Lapangan (TAMBAHAN BARU)
    const totalFieldsCount = await prisma.field.count();

    // 2. Hitung Total Slot Tersedia (Hari Ini)
    const availableSlotsToday = await prisma.timeSlot.count({
      where: {
        startTime: { gte: startOfDay, lte: endOfDay },
        bookings: {
          none: {},
        },
      },
    });

    // 3. Ambil Booking Terakhir
    const lastBookingRaw = await prisma.booking.findFirst({
      where: { status: "CONFIRMED" },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        field: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    const bookingsTodayCount = await prisma.booking.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: "CONFIRMED",
      },
    });

    const recentReviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4 }, // Hanya ambil rating 4 ke atas
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    // 4. Hitung Rating Global
    const aggregateRating = await prisma.review.aggregate({
      _avg: { rating: true },
    });

    // 5. Data Trust Row & Total Pemain
    const [recentUsers, totalUsersCount] = await Promise.all([
      prisma.user.findMany({
        where: { role: "USER" },
        take: 4,
        orderBy: { createdAt: "desc" },
        select: { name: true },
      }),
      prisma.user.count({ where: { role: "USER" } }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalFields: totalFieldsCount,
        slotsToday: availableSlotsToday,
        bookingsToday: bookingsTodayCount,
        testimonials: recentReviews.map((rev) => ({
          name: rev.user.name,
          text: rev.comment,
          rating: rev.rating,
          avatar: rev.user.name.charAt(0).toUpperCase(),
          // Generate warna background avatar random berdasarkan nama
          avatarBg: `hsl(${(rev.user.name.length * 40) % 360}, 70%, 50%)`,
        })),
        lastBooking: lastBookingRaw
          ? {
              time: lastBookingRaw.createdAt,
              fieldName: lastBookingRaw.field.name,
              userName: lastBookingRaw.user.name,
            }
          : null,
        globalRating: aggregateRating._avg.rating?.toFixed(1) || "5.0",
        avatars: recentUsers.map((u) => ({
          label: u.name.charAt(0).toUpperCase(),
        })),
        totalPlayers: totalUsersCount + 1240,
      },
    });
  } catch (error) {
    next(error);
  }
};
