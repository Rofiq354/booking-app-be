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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetailField = exports.deleteField = exports.updateField = exports.getAllField = exports.handleCreateField = void 0;
const field_1 = require("../services/field");
const AppError_1 = require("../errors/AppError");
const client_1 = require("../prisma/client");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const handleCreateField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price } = req.body;
        let imageUrl = null;
        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: "fields" }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result === null || result === void 0 ? void 0 : result.secure_url);
                });
                uploadStream.end(req.file.buffer);
            });
            imageUrl = (yield uploadPromise);
        }
        const field = yield (0, field_1.createField)(name, description, Number(price), imageUrl);
        res.status(201).json({
            status: "success",
            message: "create field success",
            data: field,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to Create Field", 500));
        }
    }
});
exports.handleCreateField = handleCreateField;
const getAllField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fields = yield client_1.prisma.field.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                slots: true,
                image: true,
                reviews: {
                    select: {
                        rating: true,
                    },
                },
            },
        });
        const fieldsWithRating = fields.map((field) => {
            const totalReviews = field.reviews.length;
            const avgRating = totalReviews > 0
                ? field.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                    totalReviews
                : 0;
            // Hapus array 'reviews' agar payload JSON lebih bersih
            const { reviews } = field, fieldData = __rest(field, ["reviews"]);
            return Object.assign(Object.assign({}, fieldData), { averageRating: parseFloat(avgRating.toFixed(1)), totalReviews: totalReviews });
        });
        res.status(200).json({
            status: "success",
            message: "Get all Field",
            data: fieldsWithRating,
        });
    }
    catch (error) {
        next(new AppError_1.AppError("Failed to display all fields", 500));
    }
});
exports.getAllField = getAllField;
const updateField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return next(new AppError_1.AppError("Invalid Field id", 400));
        const existingField = yield client_1.prisma.field.findUnique({ where: { id } });
        if (!existingField)
            return next(new AppError_1.AppError("Field not found", 404));
        const { name, description, price } = req.body;
        let imageUrl = existingField.image;
        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: "fields" }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result === null || result === void 0 ? void 0 : result.secure_url);
                });
                uploadStream.end(req.file.buffer);
            });
            imageUrl = (yield uploadPromise);
        }
        const edit = yield (0, field_1.editField)(id, name, description !== null && description !== void 0 ? description : null, price, imageUrl);
        res.status(200).json({
            status: "success",
            message: "Edit Field Successful",
            data: edit,
        });
    }
    catch (error) {
        next(error instanceof AppError_1.AppError
            ? error
            : new AppError_1.AppError("Failed to Edit Field", 500));
    }
});
exports.updateField = updateField;
const deleteField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deletefield = yield client_1.prisma.field.delete({
            where: { id },
        });
        res.status(200).json({
            status: "success",
            message: "Field successfully deleted",
        });
    }
    catch (error) {
        console.error(error);
        next(new AppError_1.AppError("failed to delete field", 500));
    }
});
exports.deleteField = deleteField;
const getDetailField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return next(new AppError_1.AppError("Invalid Field id", 400));
        const field = yield client_1.prisma.field.findUnique({
            where: { id },
            include: {
                slots: {
                    orderBy: { startTime: "asc" },
                },
                reviews: {
                    include: {
                        user: {
                            select: { name: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!field)
            return next(new AppError_1.AppError("Field not found", 404));
        const totalReviews = field.reviews.length;
        // Hitung rata-rata rating
        const averageRating = totalReviews > 0
            ? field.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                totalReviews
            : 0;
        res.status(200).json({
            status: "success",
            message: "Get detail field successfully",
            data: Object.assign(Object.assign({}, field), { ratingStats: {
                    average: parseFloat(averageRating.toFixed(1)),
                    total: totalReviews,
                } }),
        });
    }
    catch (error) {
        next(new AppError_1.AppError("failed to get detail field", 500));
    }
});
exports.getDetailField = getDetailField;
