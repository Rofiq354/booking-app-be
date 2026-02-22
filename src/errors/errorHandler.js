"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("./AppError");
function errorHandler(err, req, res, next) {
    let error;
    if (err instanceof AppError_1.AppError) {
        error = err;
    }
    else {
        console.error("UNEXPECTED ERROR:", err);
        error = new AppError_1.AppError("Internal Server Error", 500);
    }
    return res.status(error.statusCode).json({
        code: error.statusCode,
        status: error.status,
        success: error.success,
        message: error.message,
    });
}
