"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = void 0;
const client_1 = require("@prisma/client");
const isUser = (req, res, next) => {
    if (!req.user || req.user.role !== client_1.Role.USER) {
        return res.status(400).json({ message: "Forbidden" });
    }
    next();
};
exports.isUser = isUser;
