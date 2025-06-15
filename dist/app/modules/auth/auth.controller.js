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
exports.AuthControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const auth_validation_1 = require("./auth.validation");
const auth_service_1 = require("./auth.service");
// 🔐 Login
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const validatedData = auth_validation_1.AuthValidations.loginUserValidationSchema.parse(data);
        const result = yield auth_service_1.AuthServices.loginUser(validatedData);
        const { accessToken, refreshToken } = result;
        res.cookie('refreshToken', refreshToken, {
            secure: config_1.default.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: { accessToken, refreshToken },
        });
    }
    catch (error) {
        next(error);
    }
});
// 🔁 Refresh Token
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        const result = yield auth_service_1.AuthServices.refreshToken(token);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'New access token generated',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// 🔑 Change Password
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = auth_validation_1.AuthValidations.changePasswordValidationSchema.parse(req.body);
        yield auth_service_1.AuthServices.changePassword(userId, oldPassword, newPassword);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Password changed successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
// ❓ Forget Password
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = auth_validation_1.AuthValidations.forgetPasswordValidationSchema.parse(req.body);
        const result = yield auth_service_1.AuthServices.forgetPassword(email);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: result.message,
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
// 🔄 Reset Password
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = auth_validation_1.AuthValidations.resetPasswordValidationSchema.parse(req.body);
        const result = yield auth_service_1.AuthServices.resetPassword(token, newPassword);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: result.message,
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
