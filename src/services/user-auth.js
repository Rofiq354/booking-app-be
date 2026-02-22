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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLogin = exports.loginUser = exports.registerAdmin = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../prisma/client");
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../errors/AppError");
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield client_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError_1.AppError("Email already registered", 400);
    }
    const hashed = yield bcrypt_1.default.hash(password, 10);
    const user = yield client_1.prisma.user.create({
        data: { name, email, password: hashed },
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
    };
});
exports.registerUser = registerUser;
const registerAdmin = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield client_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError_1.AppError("Email already registered", 409);
    }
    const hashed = yield bcrypt_1.default.hash(password, 10);
    const user = yield client_1.prisma.user.create({
        data: { name, email, password: hashed, role: "ADMIN" },
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
    };
});
exports.registerAdmin = registerAdmin;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password)
        throw new Error("Email and password are required");
    const user = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new AppError_1.AppError("User not found", 404);
    if (!user.password)
        throw new Error("User has no password set");
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new AppError_1.AppError("Wrong Password", 401);
    const token = (0, jwt_1.signToken)({
        id: user.id,
        role: user.role,
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    };
});
exports.loginUser = loginUser;
const getUserLogin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
    });
    if (!user)
        throw new AppError_1.AppError("User not found", 404);
    return {
        user,
    };
});
exports.getUserLogin = getUserLogin;
