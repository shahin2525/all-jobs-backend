/* eslint-disable @typescript-eslint/no-explicit-any */
// import { z } from 'zod';
// import { Types } from 'mongoose';

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
import { z } from 'zod';

// Salary Range Schema (Optional)
const salaryRangeSchema = z
  .object({
    min: z.number().min(0, 'Minimum salary must be positive'),
    max: z.number().min(0, 'Maximum salary must be positive'),
    currency: z.string().default('USD'),
  })
  .optional();

// Job Schema
const jobCreateSchema = z.object({
  body: z.object({
    // Core Job Info (Required)
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description too short'),
    company: z.string().min(2, 'Company name required'),
    location: z.string().min(2, 'Location required'),

    // Salary (Optional)
    salaryRange: salaryRangeSchema.refine(
      (data) => !data || data.max >= data.min,
      'Max salary must be >= min salary',
    ),

    // Job Type (Required)
    employmentType: z.enum([
      'full-time',
      'part-time',
      'contract',
      'remote',
      'internship',
      'freelance',
    ]),

    // Job Source (Required)
    source: z.enum(['own', 'third-party']),
    applyLink: z
      .string()
      .url('Invalid URL')
      .optional()
      .superRefine((val, ctx) => {
        // Access the full data using ctx.addIssue's path
        const source = (ctx as any).parent.source; // Type assertion as workaround
        if (source === 'third-party' && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Apply link is required for third-party jobs',
          });
        }
      }),

    // Recruiter Info (Conditional)
    postedBy: z.string().optional(), // Will be set from auth middleware

    // Job Metadata (Optional)
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
    educationRequired: z.array(z.string()).optional(),
    skillsRequired: z
      .array(z.string().min(1, 'Skill cannot be empty'))
      .optional(),
  }),
});

const jobUpdateSchema = z.object({
  body: z.object({
    // Core Job Info (Optional for update)
    title: z.string().min(5, 'Title must be at least 5 characters').optional(),
    description: z.string().min(20, 'Description too short').optional(),
    company: z.string().min(2, 'Company name required').optional(),
    location: z.string().min(2, 'Location required').optional(),

    // Salary (Optional)
    salaryRange: salaryRangeSchema
      .refine(
        (data) => !data || data.max >= data.min,
        'Max salary must be >= min salary',
      )
      .optional(),

    // Job Type (Optional for update)
    employmentType: z
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
    source: z.enum(['own', 'third-party']).optional(),
    applyLink: z
      .string()
      .url('Invalid URL')
      .optional()
      .superRefine((val, ctx) => {
        const source = (ctx as any).parent.source;
        if (source === 'third-party' && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Apply link is required for third-party jobs',
          });
        }
      }),

    // Job Metadata (Optional)
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
    educationRequired: z.array(z.string()).optional(),
    skillsRequired: z
      .array(z.string().min(1, 'Skill cannot be empty'))
      .optional(),
  }),
});

// Export schemas
export const JobValidation = {
  jobCreateSchema,
  jobUpdateSchema,
};
