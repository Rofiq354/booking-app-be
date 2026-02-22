"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RegisterSchema = joi_1.default.object({
    name: joi_1.default.string().min(4).max(25).required().messages({
        "string.min": "nama minimal 3 karakter",
        "string.max": "nama maksimal 20 karakter",
        "any.required": "nama wajib diisi",
        "string.empty": "nama tidak boleh kosong",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email tidak valid",
        "any.required": "Email wajib diisi",
        "string.empty": "Email tidak boleh kosong",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.min": "Password minimal 8 karakter",
        "any.required": "Password wajib diisi",
        "string.empty": "Password tidak boleh kosong",
    }),
});
exports.LoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email tidak valid",
        "any.required": "Email wajib diisi",
        "string.empty": "Email tidak boleh kosong",
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "Password wajib diisi",
        "string.empty": "Password tidak boleh kosong",
    }),
});
