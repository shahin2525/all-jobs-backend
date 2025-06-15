"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
// Helper schema for MongoDB ObjectId validation
const objectIdSchema = zod_1.z
    .string()
    .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
});
exports.jobSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    company: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    source: zod_1.z.enum(['own', 'third-party']),
    isCompliant: zod_1.z.boolean(),
    applyLink: zod_1.z.string().url('Invalid URL format').optional(),
    postedBy: objectIdSchema,
});
