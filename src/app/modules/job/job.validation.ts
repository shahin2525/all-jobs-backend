import { z } from 'zod';

// Salary Range Schema (Optional)
const salaryRangeSchema = z
  .object({
    min: z.number().min(0, 'Minimum salary must be positive'),
    max: z.number().min(0, 'Maximum salary must be positive'),
    currency: z.string().default('USD').optional(),
  })
  .optional();

// Job Schema
export const jobCreateSchema = z.object({
  body: z
    .object({
      // Core Job Info (Required)
      title: z.string().min(5, 'Title must be at least 5 characters'),
      description: z.string().min(20, 'Description too short'),
      company: z.string().min(2, 'Company name required'),
      location: z.string().min(2, 'Location required'),

      // Salary (Optional)
      salaryRange: salaryRangeSchema
        .refine(
          (data) => !data || data.max >= data.min,
          'Max salary must be >= min salary',
        )
        .optional(),

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

      applyLink: z.string().url('Invalid URL').optional(),

      // Recruiter Info (Conditional)
      // postedBy: z.string().optional(), // Will be set from auth middleware

      // Job Metadata (Optional)
      experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
      educationRequired: z.array(z.string()).optional(),
      skillsRequired: z
        .array(z.string().min(1, 'Skill cannot be empty'))
        .optional(),
    })
    .refine((data) => !(data.source === 'third-party' && !data.applyLink), {
      message: 'Apply link is required for third-party jobs',
      path: ['applyLink'], // Highlights the field in error
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
    applyLink: z.string().url('Invalid URL').optional(),
    // .superRefine((val, ctx) => {
    //   const source = (ctx as any).parent.source;
    //   if (source === 'third-party' && !val) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: 'Apply link is required for third-party jobs',
    //     });
    //   }
    // }),

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
