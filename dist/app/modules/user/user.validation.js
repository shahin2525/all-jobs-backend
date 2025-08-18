"use strict";
// import { z } from 'zod';
// import validator from 'validator';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidationSchema = void 0;
// // Helper for password validation
// const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
// export const TUserValidationSchema = z
//   .object({
//     name: z.object({
//       firstName: z.string().min(2, 'First name too short').max(50),
//       lastName: z.string().min(2, 'Last name too short').max(50),
//     }),
//     email: z
//       .string()
//       .email('Invalid email')
//       .refine(validator.isEmail, 'Invalid email format'), // Extra validation
//     password: z
//       .string()
//       .min(8, 'Password must be 8+ characters')
//       .regex(passwordRegex, 'Requires 1 uppercase, 1 symbol, and 1 number'),
//     phone: z
//       .string()
//       .refine(validator.isMobilePhone, 'Invalid phone number')
//       .optional(),
//     role: z.enum(['admin', 'recruiter', 'candidate']).default('candidate'),
//     isActive: z.boolean().default(true),
//     isVerified: z.boolean().default(false),
//     passwordChangedAt: z.date().optional(),
//     passwordResetToken: z.string().optional(),
//     passwordResetExpires: z.date().optional(),
//     profile: z
//       .object({
//         skills: z.array(z.string().min(1)).optional(),
//         company: z.string().min(2).optional(),
//         avatar: z.string().url('Invalid URL').optional(),
//       })
//       .optional(),
//   })
//   .strict(); // Forbid unknown keys
const zod_1 = require("zod");
const user_const_1 = require("./user.const");
// Convert USER_ROLE enum to array of keys
const userRoles = Object.keys(user_const_1.USER_ROLE);
exports.createUserValidationSchema = zod_1.z.object({
    name: zod_1.z.object({
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
    }),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(userRoles, {
        errorMap: () => ({
            message: 'Role must be admin, recruiter, or candidate',
        }),
    }),
    isActive: zod_1.z.boolean().default(true),
    isVerified: zod_1.z.boolean().default(false),
    lastLogin: zod_1.z.date().optional(),
    passwordChangedAt: zod_1.z.date().optional(),
    passwordResetToken: zod_1.z.string().optional(),
    passwordResetExpires: zod_1.z.date().optional(),
    profile: zod_1.z
        .object({
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        company: zod_1.z.string().optional(),
        avatar: zod_1.z.string().url('Avatar must be a valid URL').optional(),
    })
        .optional(),
    createdAt: zod_1.z.date().optional(), // Usually set from backend
    updatedAt: zod_1.z.date().optional(), // Usually set from backend
});
