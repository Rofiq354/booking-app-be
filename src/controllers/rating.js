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
exports.createReview = void 0;
const client_1 = require("../prisma/client");
const AppError_1 = require("../errors/AppError");
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { bookingId, rating, comment } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!rating || rating < 1 || rating > 5) {
            return next(new AppError_1.AppError("Rating must be between 1 and 5", 400));
        }
        // Cari Booking & Validasi (Milik User & Status CONFIRMED)
        const booking = yield client_1.prisma.booking.findFirst({
            where: {
                id: Number(bookingId),
                userId: Number(userId),
                status: "CONFIRMED",
            },
            include: { review: true },
        });
        if (!booking) {
            return next(new AppError_1.AppError("Booking not found or not yet confirmed", 404));
        }
        // Cek apakah booking ini sudah pernah di-review
        if (booking.review) {
            return next(new AppError_1.AppError("This booking has already been reviewed", 400));
        }
        const newReview = yield client_1.prisma.review.create({
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
    }
    catch (error) {
        console.error(error);
        next(new AppError_1.AppError("Internal Server Error", 500));
    }
});
exports.createReview = createReview;
