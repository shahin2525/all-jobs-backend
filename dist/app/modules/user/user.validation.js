"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUserSchema = void 0;
const zod_1 = require("zod");
const validator_1 = __importDefault(require("validator"));
// Helper for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
exports.TUserSchema = zod_1.z
    .object({
    name: zod_1.z.object({
        firstName: zod_1.z.string().min(2, 'First name too short').max(50),
        lastName: zod_1.z.string().min(2, 'Last name too short').max(50),
    }),
    email: zod_1.z
        .string()
        .email('Invalid email')
        .refine(validator_1.default.isEmail, 'Invalid email format'), // Extra validation
    password: zod_1.z
        .string()
        .min(8, 'Password must be 8+ characters')
        .regex(passwordRegex, 'Requires 1 uppercase, 1 symbol, and 1 number'),
    phone: zod_1.z
        .string()
        .refine(validator_1.default.isMobilePhone, 'Invalid phone number')
        .optional(),
    role: zod_1.z.enum(['admin', 'recruiter', 'candidate']).default('candidate'),
    isActive: zod_1.z.boolean().default(true),
    isVerified: zod_1.z.boolean().default(false),
    passwordChangedAt: zod_1.z.date().optional(),
    passwordResetToken: zod_1.z.string().optional(),
    passwordResetExpires: zod_1.z.date().optional(),
    profile: zod_1.z
        .object({
        skills: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        company: zod_1.z.string().min(2).optional(),
        avatar: zod_1.z.string().url('Invalid URL').optional(),
    })
        .optional(),
})
    .strict(); // Forbid unknown keys
