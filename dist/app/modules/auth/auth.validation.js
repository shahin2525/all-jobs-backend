"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
// // Role Enum
// export const roleEnum = z.enum(['admin', 'employee', 'recruiter']);
// // 🔐 Login Validation
// export const userLoginValidation = z.object({
//   body: z.object({
//     email: z.string().email({ message: 'Invalid email address' }),
//     password: z
//       .string()
//       .min(6, { message: 'Password must be at least 6 characters' }),
//   }),
// });
// // 🔁 Refresh Token Validation
// export const refreshTokenValidation = z.object({
//   cookies: z.object({
//     refreshToken: z.string({
//       required_error: 'Refresh token is required',
//     }),
//   }),
// });
// // 🔑 Change Password Validation
// export const changePasswordValidation = z.object({
//   body: z.object({
//     oldPassword: z.string().min(6, { message: 'Old password is required' }),
//     newPassword: z
//       .string()
//       .min(6, { message: 'New password must be at least 6 characters' }),
//   }),
// });
// // ❓ Forget Password Validation
// export const forgetPasswordValidation = z.object({
//   body: z.object({
//     email: z.string().email({ message: 'Please enter a valid email address' }),
//   }),
// });
// // 🔄 Reset Password Validation
// export const resetPasswordValidation = z.object({
//   body: z.object({
//     token: z.string({ required_error: 'Reset token is required' }),
//     newPassword: z
//       .string()
//       .min(6, { message: 'New password must be at least 6 characters' }),
//   }),
// });
// auth.validation.ts
const zod_1 = require("zod");
const loginUserValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const changePasswordValidationSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const resetPasswordValidationSchema = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string().min(6),
});
exports.AuthValidations = {
    loginUserValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
