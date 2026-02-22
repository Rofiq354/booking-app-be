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
exports.handleCancelBooking = exports.handleApproveBooking = exports.bookingField = void 0;
const AppError_1 = require("../errors/AppError");
const client_1 = require("../prisma/client");
const bookingField = (userId, fieldId, slotId) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield client_1.prisma.timeSlot.findUnique({
        where: { id: slotId },
    });
    if (!slot)
        throw new AppError_1.AppError("Slot not found", 404);
    const existingBooking = yield client_1.prisma.booking.findFirst({
        where: { slotId, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (existingBooking)
        throw new AppError_1.AppError("Slot already booked", 400);
    const createBooking = client_1.prisma.booking.create({
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
});
exports.bookingField = bookingField;
const handleApproveBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield client_1.prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new AppError_1.AppError("Booking not found", 404);
    }
    if (booking.status !== "PENDING") {
        throw new AppError_1.AppError("Pending cancellation or already approved", 400);
    }
    const approveBooking = yield client_1.prisma.booking.update({
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
});
exports.handleApproveBooking = handleApproveBooking;
const handleCancelBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield client_1.prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new AppError_1.AppError("Booking not found", 404);
    }
    if (booking.status !== "PENDING") {
        throw new AppError_1.AppError("Pending cancellation or already approved", 400);
    }
    const cancelBooking = yield client_1.prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "CANCELLED",
        },
    });
    return cancelBooking;
});
exports.handleCancelBooking = handleCancelBooking;
