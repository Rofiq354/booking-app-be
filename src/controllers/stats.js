"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeroStats = void 0;
const client_1 = require("../prisma/client");
const getHeroStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        // 1. Hitung Total Lapangan (TAMBAHAN BARU)
        const totalFieldsCount = yield client_1.prisma.field.count();
        // 2. Hitung Total Slot Tersedia (Hari Ini)
        const availableSlotsToday = yield client_1.prisma.timeSlot.count({
            where: {
                startTime: { gte: startOfDay, lte: endOfDay },
                bookings: {
                    none: {},
                },
            },
        });
        // 3. Ambil Booking Terakhir
        const lastBookingRaw = yield client_1.prisma.booking.findFirst({
            where: { status: "CONFIRMED" },
            orderBy: { createdAt: "desc" },
            select: {
                createdAt: true,
                field: { select: { name: true } },
                user: { select: { name: true } },
            },
        });
        const bookingsTodayCount = yield client_1.prisma.booking.count({
            where: {
                createdAt: { gte: startOfDay, lte: endOfDay },
                status: "CONFIRMED",
            },
        });
        const recentReviews = yield client_1.prisma.review.findMany({
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
        const aggregateRating = yield client_1.prisma.review.aggregate({
            _avg: { rating: true },
        });
        // 5. Data Trust Row & Total Pemain
        const [recentUsers, totalUsersCount] = yield Promise.all([
            client_1.prisma.user.findMany({
                where: { role: "USER" },
                take: 4,
                orderBy: { createdAt: "desc" },
                select: { name: true },
            }),
            client_1.prisma.user.count({ where: { role: "USER" } }),
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
                globalRating: ((_a = aggregateRating._avg.rating) === null || _a === void 0 ? void 0 : _a.toFixed(1)) || "5.0",
                avatars: recentUsers.map((u) => ({
                    label: u.name.charAt(0).toUpperCase(),
                })),
                totalPlayers: totalUsersCount + 1240,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getHeroStats = getHeroStats;
