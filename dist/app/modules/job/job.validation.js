"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { z } from 'zod';
// import { Types } from 'mongoose';
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidation = void 0;
// // Helper schema for MongoDB ObjectId validation
// const objectIdSchema = z
//   .string()
//   .refine((value) => Types.ObjectId.isValid(value), {
//     message: 'Invalid ObjectId',
//   });
// export const jobSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   company: z.string().optional(),
//   location: z.string().optional(),
//   source: z.enum(['own', 'third-party']),
//   isCompliant: z.boolean(),
//   applyLink: z.string().url('Invalid URL format').optional(),
//   postedBy: objectIdSchema,
// });
// // You can also create a type from the schema if needed
// export type JobInput = z.infer<typeof jobSchema>;
const zod_1 = require("zod");
// Salary Range Schema (Optional)
const salaryRangeSchema = zod_1.z
    .object({
    min: zod_1.z.number().min(0, 'Minimum salary must be positive'),
    max: zod_1.z.number().min(0, 'Maximum salary must be positive'),
    currency: zod_1.z.string().default('USD'),
})
    .optional();
// Job Schema
const jobCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Core Job Info (Required)
        title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
        description: zod_1.z.string().min(20, 'Description too short'),
        company: zod_1.z.string().min(2, 'Company name required'),
        location: zod_1.z.string().min(2, 'Location required'),
        // Salary (Optional)
        salaryRange: salaryRangeSchema.refine((data) => !data || data.max >= data.min, 'Max salary must be >= min salary'),
        // Job Type (Required)
        employmentType: zod_1.z.enum([
            'full-time',
            'part-time',
            'contract',
            'remote',
            'internship',
            'freelance',
        ]),
        // Job Source (Required)
        source: zod_1.z.enum(['own', 'third-party']),
        applyLink: zod_1.z
            .string()
            .url('Invalid URL')
            .optional()
            .superRefine((val, ctx) => {
            // Access the full data using ctx.addIssue's path
            const source = ctx.parent.source; // Type assertion as workaround
            if (source === 'third-party' && !val) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: 'Apply link is required for third-party jobs',
                });
            }
        }),
        // Recruiter Info (Conditional)
        postedBy: zod_1.z.string().optional(), // Will be set from auth middleware
        // Job Metadata (Optional)
        experienceLevel: zod_1.z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
        educationRequired: zod_1.z.array(zod_1.z.string()).optional(),
        skillsRequired: zod_1.z
            .array(zod_1.z.string().min(1, 'Skill cannot be empty'))
            .optional(),
    }),
});
const jobUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Core Job Info (Optional for update)
        title: zod_1.z.string().min(5, 'Title must be at least 5 characters').optional(),
        description: zod_1.z.string().min(20, 'Description too short').optional(),
        company: zod_1.z.string().min(2, 'Company name required').optional(),
        location: zod_1.z.string().min(2, 'Location required').optional(),
        // Salary (Optional)
        salaryRange: salaryRangeSchema
            .refine((data) => !data || data.max >= data.min, 'Max salary must be >= min salary')
            .optional(),
        // Job Type (Optional for update)
        employmentType: zod_1.z
            .enum([
            'full-time',
            'part-time',
            'contract',
            'remote',
            'internship',
            'freelance',
        ])
            .optional(),
        // Job Source (Optional for update)
        source: zod_1.z.enum(['own', 'third-party']).optional(),
        applyLink: zod_1.z
            .string()
            .url('Invalid URL')
            .optional()
            .superRefine((val, ctx) => {
            const source = ctx.parent.source;
            if (source === 'third-party' && !val) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: 'Apply link is required for third-party jobs',
                });
            }
        }),
        // Job Metadata (Optional)
        experienceLevel: zod_1.z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
        educationRequired: zod_1.z.array(zod_1.z.string()).optional(),
        skillsRequired: zod_1.z
            .array(zod_1.z.string().min(1, 'Skill cannot be empty'))
            .optional(),
    }),
});
// Export schemas
exports.JobValidation = {
    jobCreateSchema,
    jobUpdateSchema,
};
