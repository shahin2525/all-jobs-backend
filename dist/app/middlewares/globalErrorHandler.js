"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const httpErrors_1 = require("../errors/httpErrors");
const globalErrorHandler = (err, req, res, next) => {
    // Default error response structure
    const errorResponse = {
        success: false,
        message: err.message || 'Something went wrong!',
        errorDetails: err.details || null,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    };
    // Handle Zod Validation Errors
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        errorResponse.message = 'Validation Error';
        errorResponse.errorDetails = formattedErrors;
        res.status(400).json(errorResponse);
        return; // Ensure no further execution
    }
    // Handle Mongoose Errors
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        errorResponse.message = 'Validation Error';
        errorResponse.errorDetails = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        res.status(400).json(errorResponse);
        return;
    }
    if (err instanceof mongoose_1.default.Error.CastError) {
        errorResponse.message = `Invalid ${err.path}: ${err.value}`;
        res.status(400).json(errorResponse);
        return;
    }
    // Handle Custom HTTP Errors
    if (err instanceof httpErrors_1.HttpException) {
        res.status(err.status).json(Object.assign(Object.assign({}, errorResponse), { message: err.message, errorDetails: err.details || null }));
        return;
    }
    // Handle Unexpected Errors (500)
    console.error('🚨 Unexpected Error:', err);
    const serverError = new httpErrors_1.InternalServerError();
    res.status(serverError.status).json(Object.assign(Object.assign({}, errorResponse), { message: serverError.message }));
    return;
};
exports.default = globalErrorHandler;
