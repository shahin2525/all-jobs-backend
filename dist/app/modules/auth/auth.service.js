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
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
// import { ILoginInput, ITokenPayload } from '../interfaces/auth.interface';
const auth_utils2_1 = require("./auth.utils2");
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../error/appError"));
const http_status_codes_1 = require("http-status-codes");
// 🔐 Login
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'password does not match');
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        isActive: user === null || user === void 0 ? void 0 : user.isActive,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, auth_utils2_1.createToken)(jwtPayload, config_1.default.access_secret, config_1.default.jwt_access_expire_in);
    const refreshToken = (0, auth_utils2_1.createToken)(jwtPayload, config_1.default.refresh_secret, config_1.default.jwt_refresh_expire_in);
    return {
        accessToken,
        refreshToken,
        // user: {
        //   _id: user._id,
        //   email: user.email,
        //   role: user.role,
        // },
    };
});
// 🔁 Refresh Token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, auth_utils2_1.verifyToken)(token, config_1.default.refresh_secret);
        const { userId } = decoded;
        // checking if the user is exist
        const user = yield user_model_1.User.findOne(userId);
        if (!user)
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        // checking if the user is blocked
        const userActive = user === null || user === void 0 ? void 0 : user.isActive;
        if (!userActive) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is in blocked ! !');
        }
        const jwtPayload = {
            userId: user === null || user === void 0 ? void 0 : user._id,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            isActive: user === null || user === void 0 ? void 0 : user.isActive,
            role: user === null || user === void 0 ? void 0 : user.role,
        };
        const accessToken = (0, auth_utils2_1.createToken)(jwtPayload, config_1.default.access_secret, config_1.default.jwt_access_expire_in);
        return { accessToken };
    }
    catch (_a) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid refresh token');
    }
});
// 🔑 Change Password
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Old password is incorrect');
    const hashed = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.salt));
    // user.password = hashed;
    // await user.save();
    yield user_model_1.User.findOneAndUpdate({
        id: user._id,
        role: user.role,
    }, {
        password: hashed,
        passwordChangedAt: new Date(),
    });
    return null;
});
// ❓ Forget Password
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No user found with this email');
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        isActive: user === null || user === void 0 ? void 0 : user.isActive,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const resetToken = (0, auth_utils2_1.createToken)(jwtPayload, config_1.default.access_secret, config_1.default.jwt_access_expire_in);
    const resetUrl = `${config_1.default.resend}/reset-password?token=${resetToken}`;
    yield (0, auth_utils_1.sendResetPasswordEmail)(email, resetUrl);
    return { message: 'Reset password email sent' };
});
// 🔄 Reset Password
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, auth_utils2_1.verifyToken)(token, config_1.default.refresh_secret);
        const { userId } = decoded;
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        const hashed = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashed;
        yield user.save();
        return { message: 'Password reset successfully' };
    }
    catch (_a) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid or expired token');
    }
});
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
