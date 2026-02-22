"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    const payload = (0, jwt_1.verifyToken)(token);
    if (!payload)
        return res.status(401).json({ message: "Invalid token" });
    req.user = payload;
    next();
};
exports.authenticate = authenticate;
