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
exports.editField = exports.createField = void 0;
const AppError_1 = require("../errors/AppError");
const client_1 = require("../prisma/client");
const createField = (name, description, price, image) => __awaiter(void 0, void 0, void 0, function* () {
    const existingField = yield client_1.prisma.field.findUnique({
        where: { name },
    });
    if (existingField) {
        throw new AppError_1.AppError("The field name is already available.", 409);
    }
    const field = yield client_1.prisma.field.create({
        data: {
            name,
            description,
            price,
            image,
        },
    });
    return {
        id: field.id,
        name: field.name,
        description: field.description,
        price: field.price,
        image: field.image,
        created_at: field.createdAt,
        updated_at: field.updatedAt,
    };
});
exports.createField = createField;
const editField = (id, name, description, price, image) => __awaiter(void 0, void 0, void 0, function* () {
    const field = yield client_1.prisma.field.findUnique({
        where: { id },
    });
    if (!field)
        throw new AppError_1.AppError("field not found", 404);
    const editField = yield client_1.prisma.field.update({
        where: { id },
        data: {
            name,
            description,
            price,
            image,
        },
    });
    return editField;
});
exports.editField = editField;
