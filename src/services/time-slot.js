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
exports.getFieldTimeSlots = exports.createTimeSlots = void 0;
const client_1 = require("../prisma/client");
const AppError_1 = require("../errors/AppError");
const createTimeSlots = (fieldId, startHour, endHour, date) => __awaiter(void 0, void 0, void 0, function* () {
    if (startHour >= endHour) {
        throw new AppError_1.AppError("startHour must be earlier than endHour", 400);
    }
    const slotsData = [];
    for (let hour = startHour; hour < endHour; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);
        slotsData.push({ fieldId, startTime, endTime });
    }
    yield client_1.prisma.timeSlot.createMany({
        data: slotsData,
        skipDuplicates: true,
    });
    const slots = yield client_1.prisma.timeSlot.findMany({
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
            bookingId: (activeBooking === null || activeBooking === void 0 ? void 0 : activeBooking.id) || null,
        };
    });
});
exports.createTimeSlots = createTimeSlots;
const getFieldTimeSlots = (fieldId) => __awaiter(void 0, void 0, void 0, function* () {
    const slots = yield client_1.prisma.timeSlot.findMany({
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
            bookingId: (activeBooking === null || activeBooking === void 0 ? void 0 : activeBooking.id) || null,
        };
    });
});
exports.getFieldTimeSlots = getFieldTimeSlots;
