"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
// 404 Handler - MUST be after all other routes
const notFoundRoute = (req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        error: '',
    });
};
exports.default = notFoundRoute;
