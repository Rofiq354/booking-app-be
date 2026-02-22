"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const client_1 = require("@prisma/client");
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== client_1.Role.ADMIN) {
        return res.status(400).json({ message: "Forbidden" });
    }
    next();
};
exports.isAdmin = isAdmin;
