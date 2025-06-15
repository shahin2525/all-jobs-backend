"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.forgetPasswordValidation = exports.changePasswordValidation = exports.refreshTokenValidation = exports.userLoginValidation = exports.roleEnum = void 0;
const zod_1 = require("zod");
// Role Enum
exports.roleEnum = zod_1.z.enum(['admin', 'employee', 'recruiter']);
// 🔐 Login Validation
exports.userLoginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        password: zod_1.z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' }),
    }),
});
// 🔁 Refresh Token Validation
exports.refreshTokenValidation = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});
// 🔑 Change Password Validation
exports.changePasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(6, { message: 'Old password is required' }),
        newPassword: zod_1.z
            .string()
            .min(6, { message: 'New password must be at least 6 characters' }),
    }),
});
// ❓ Forget Password Validation
exports.forgetPasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    }),
});
// 🔄 Reset Password Validation
exports.resetPasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({ required_error: 'Reset token is required' }),
        newPassword: zod_1.z
            .string()
            .min(6, { message: 'New password must be at least 6 characters' }),
    }),
});
