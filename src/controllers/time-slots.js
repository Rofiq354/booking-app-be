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
exports.getSlotsController = exports.createSlotsController = void 0;
const time_slot_1 = require("../services/time-slot");
const client_1 = require("../prisma/client");
const AppError_1 = require("../errors/AppError");
const createSlotsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fieldId = Number(req.params.fieldId);
        const { date, startHour, endHour } = req.body;
        if (isNaN(fieldId))
            return next(new AppError_1.AppError("fieldId must be a number", 400));
        if (!date || startHour === undefined || endHour === undefined) {
            return next(new AppError_1.AppError("fieldId, date, startHour, endHour are required", 400));
        }
        const field = yield client_1.prisma.field.findUnique({
            where: { id: Number(fieldId) },
        });
        if (!field)
            return next(new AppError_1.AppError("Field not found", 404));
        const slots = yield (0, time_slot_1.createTimeSlots)(fieldId, startHour, endHour, new Date(date));
        res.status(200).json({
            status: "success",
            message: "Slots created and retrieved successfully",
            data: {
                id: field.id,
                name: field.name,
                description: field.description,
                price: field.price,
                slots,
            },
        });
    }
    catch (error) {
        next(new AppError_1.AppError("Failed to Create Slot", 500));
    }
});
exports.createSlotsController = createSlotsController;
const getSlotsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fieldId = Number(req.params.fieldId);
        const field = yield client_1.prisma.field.findUnique({ where: { id: fieldId } });
        if (!field)
            return next(new AppError_1.AppError("Field not found", 404));
        const slots = yield (0, time_slot_1.getFieldTimeSlots)(fieldId);
        res.status(200).json({
            status: "success",
            message: "Get slot time field ",
            data: {
                id: field.id,
                name: field.name,
                description: field.description,
                price: field.price,
                slots,
            },
        });
    }
    catch (error) {
        next(new AppError_1.AppError("Failed to get Slot", 500));
    }
});
exports.getSlotsController = getSlotsController;
