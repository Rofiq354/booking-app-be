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
exports.getAllUserPending = exports.userCancelBooking = exports.getUserBooking = exports.rejectBooking = exports.approveBooking = exports.getAllBooking = exports.createBooking = void 0;
const booking_1 = require("../services/booking");
const AppError_1 = require("../errors/AppError");
const client_1 = require("../prisma/client");
const email_1 = require("../utils/email");
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { fieldId, slotId } = req.body;
        const booking = yield (0, booking_1.bookingField)(userId, fieldId, slotId);
        try {
            yield (0, email_1.sendEmail)(booking.user.email, booking.field.name, booking.slot.startTime, booking.slot.endTime, booking.field.price);
        }
        catch (error) {
            console.error("Email gagal dikirim:", error);
        }
        res.status(201).json({
            status: "success",
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to booking field", 500));
        }
    }
});
exports.createBooking = createBooking;
const getAllBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBooking = yield client_1.prisma.booking.findMany({
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
    }
    catch (error) {
        next(new AppError_1.AppError("Failed to get All Booking", 500));
    }
});
exports.getAllBooking = getAllBooking;
const approveBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = Number(req.params.id);
        const accBooking = yield (0, booking_1.handleApproveBooking)(bookingId);
        res.status(200).json({
            status: "success",
            meesage: "Booking approve successfuly",
            data: accBooking,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to approve booking", 500));
        }
    }
});
exports.approveBooking = approveBooking;
const rejectBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = Number(req.params.id);
        const cancelBooking = yield (0, booking_1.handleCancelBooking)(bookingId);
        res.status(200).json({
            status: "success",
            message: "Cancel booking successfuly",
            data: cancelBooking,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to cancel booking", 500));
        }
    }
});
exports.rejectBooking = rejectBooking;
const getUserBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: "error",
            message: "Invalid user id",
        });
    }
    try {
        const userBooking = yield client_1.prisma.booking.findMany({
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
    }
    catch (error) {
        next(new AppError_1.AppError("Failed to get User Booking", 500));
    }
});
exports.getUserBooking = getUserBooking;
const userCancelBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const bookingId = Number(req.params.id);
        const booking = yield client_1.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new AppError_1.AppError("Booking not found", 400);
        }
        if (booking.userId !== userId) {
            throw new AppError_1.AppError("You cannot cancel this booking.", 403);
        }
        if (booking.status === "CONFIRMED") {
            throw new AppError_1.AppError("Confirmed bookings cannot be cancelled.", 400);
        }
        if (booking.status === "CANCELLED") {
            throw new AppError_1.AppError("booking has been cancelled.", 400);
        }
        const cancel = yield client_1.prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" },
        });
        res.status(200).json({
            status: "success",
            message: "Booking cancelled successfully",
            data: cancel,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to cancel booking", 500));
        }
    }
});
exports.userCancelBooking = userCancelBooking;
const getAllUserPending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.prisma.booking.findMany({
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
    }
    catch (error) {
        next(new AppError_1.AppError("Failed to get Pending User", 500));
    }
});
exports.getAllUserPending = getAllUserPending;
