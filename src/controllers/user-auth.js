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
exports.handleGetAdmins = exports.userLogout = exports.userLogin = exports.handleLoginUser = exports.handleCreateAdmin = exports.handleRegisterUser = void 0;
const userAuth_1 = require("../validation/userAuth");
const user_auth_1 = require("../services/user-auth");
const AppError_1 = require("../errors/AppError");
const client_1 = require("../prisma/client");
const handleRegisterUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = userAuth_1.RegisterSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error === null || error === void 0 ? void 0 : error.details.reduce((acc, detail) => {
                const key = detail.path[0];
                acc[key] = detail.message;
                return acc;
            }, {});
            return res.status(400).json({
                code: 400,
                success: false,
                message: errors,
            });
        }
        const { name, email, password } = value;
        const user = yield (0, user_auth_1.registerUser)(name, email, password);
        res.status(201).json({
            status: "success",
            message: "Register Successfull",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to Register User", 500));
        }
    }
});
exports.handleRegisterUser = handleRegisterUser;
const handleCreateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = userAuth_1.RegisterSchema.validate(req.body);
        if (error) {
            const errors = error === null || error === void 0 ? void 0 : error.details.reduce((acc, detail) => {
                const key = detail.path[0];
                acc[key] = detail.message;
                return acc;
            }, {});
            return res.status(400).json({
                code: 400,
                success: false,
                message: errors,
            });
        }
        const { name, email, password } = req.body;
        const admin = yield (0, user_auth_1.registerAdmin)(name, email, password);
        res.status(201).json({
            status: "success",
            message: "Register Admin Successfull",
            data: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                created_at: admin.created_at,
            },
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to Create Admin", 500));
        }
    }
});
exports.handleCreateAdmin = handleCreateAdmin;
const handleLoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = userAuth_1.LoginSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error === null || error === void 0 ? void 0 : error.details.reduce((acc, detail) => {
                const key = detail.path[0];
                acc[key] = detail.message;
                return acc;
            }, {});
            return res.status(400).json({
                code: 400,
                success: false,
                message: errors,
            });
        }
        const { email, password } = value;
        const user = yield (0, user_auth_1.loginUser)(email, password);
        res.cookie("token", user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            message: "Login Successfull",
            data: user,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to Login User", 500));
        }
    }
});
exports.handleLoginUser = handleLoginUser;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield (0, user_auth_1.getUserLogin)(req.user.id);
        res.json({ data: user });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError("Failed to Login User", 500));
        }
    }
});
exports.userLogin = userLogin;
const userLogout = (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({ status: "success", message: "Logout Berhasil" });
};
exports.userLogout = userLogout;
const handleGetAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield client_1.prisma.user.findMany({
        where: { role: "ADMIN" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    res.json({
        status: "success",
        data: admins,
    });
});
exports.handleGetAdmins = handleGetAdmins;
