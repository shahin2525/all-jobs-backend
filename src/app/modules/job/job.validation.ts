// import { z } from 'zod';

// // Salary Range Schema (Optional)
// const salaryRangeSchema = z
//   .object({
//     min: z.number().min(0, 'Minimum salary must be positive'),
//     max: z.number().min(0, 'Maximum salary must be positive'),
//     currency: z.string().default('USD').optional(),
//   })
//   .optional();

// // Job Schema
// export const jobCreateSchema = z.object({
//   body: z
//     .object({
//       // Core Job Info (Required)
//       title: z.string().min(5, 'Title must be at least 5 characters'),
//       description: z.string().min(20, 'Description too short'),
//       company: z.string().min(2, 'Company name required'),
//       location: z.string().min(2, 'Location required'),

//       // Salary (Optional)
//       salaryRange: salaryRangeSchema
//         .refine(
//           (data) => !data || data.max >= data.min,
//           'Max salary must be >= min salary',
//         )
//         .optional(),

//       // Job Type (Required)
//       employmentType: z.enum([
//         'full-time',
//         'part-time',
//         'contract',
//         'remote',
//         'internship',
//         'freelance',
//       ]),

//       // Job Source (Required)
//       source: z.enum(['own', 'third-party']),

//       applyLink: z.string().url('Invalid URL').optional(),

//       // Recruiter Info (Conditional)
//       // postedBy: z.string().optional(), // Will be set from auth middleware

//       // Job Metadata (Optional)
//       experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
//       educationRequired: z.array(z.string()).optional(),
//       skillsRequired: z
//         .array(z.string().min(1, 'Skill cannot be empty'))
//         .optional(),
//     })
//     .refine((data) => !(data.source === 'third-party' && !data.applyLink), {
//       message: 'Apply link is required for third-party jobs',
//       path: ['applyLink'], // Highlights the field in error
//     }),
// });

// const jobUpdateSchema = z.object({
//   body: z.object({
//     // Core Job Info (Optional for update)
//     title: z.string().min(5, 'Title must be at least 5 characters').optional(),
//     description: z.string().min(20, 'Description too short').optional(),
//     company: z.string().min(2, 'Company name required').optional(),
//     location: z.string().min(2, 'Location required').optional(),

//     // Salary (Optional)
//     salaryRange: salaryRangeSchema
//       .refine(
//         (data) => !data || data.max >= data.min,
//         'Max salary must be >= min salary',
//       )
//       .optional(),

//     // Job Type (Optional for update)
//     employmentType: z
//       .enum([
//         'full-time',
//         'part-time',
//         'contract',
//         'remote',
//         'internship',
//         'freelance',
//       ])
//       .optional(),

//     // Job Source (Optional for update)
//     source: z.enum(['own', 'third-party']).optional(),
//     applyLink: z.string().url('Invalid URL').optional(),
//     // .superRefine((val, ctx) => {
//     //   const source = (ctx as any).parent.source;
//     //   if (source === 'third-party' && !val) {
//     //     ctx.addIssue({
//     //       code: z.ZodIssueCode.custom,
//     //       message: 'Apply link is required for third-party jobs',
//     //     });
//     //   }
//     // }),

//     // Job Metadata (Optional)
//     experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
//     educationRequired: z.array(z.string()).optional(),
//     skillsRequired: z
//       .array(z.string().min(1, 'Skill cannot be empty'))
//       .optional(),
//   }),
// });

// // Export schemas
// export const JobValidation = {
//   jobCreateSchema,
//   jobUpdateSchema,
// };

import { z } from 'zod';
import { Types } from 'mongoose';

// Helper for ObjectId validation
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Salary Range Schema
const salaryRangeSchema = z
  .object({
    min: z.number().positive('Salary minimum must be positive'),
    max: z.number().positive('Salary maximum must be positive'),
    currency: z.string().min(1, 'Currency is required'),
    unitText: z.enum(['MONTH', 'HOUR', 'YEAR', 'DAY']),
  })
  .refine((data) => data.max >= data.min, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['max'],
  });

// Job Location Schema
const jobLocationSchema = z.object({
  addressCountry: z.string().min(1, 'Country is required'),
  addressRegion: z.string().optional(),
  addressLocality: z.string().min(1, 'Locality is required'),
  postalCode: z.string().optional(),
  streetAddress: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Create a separate refinement function for applyLink validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyLinkRefinement = (data: any) => {
  if (
    data.source === 'third-party' &&
    (!data.applyLink || data.applyLink.trim() === '')
  ) {
    return false;
  }
  return true;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sourceNameRefinement = (data: any) => {
  if (
    data.source === 'third-party' &&
    (!data.sourceName || data.sourceName.trim() === '')
  ) {
    return false;
  }
  return true;
};
// Base Job Schema for creation
export const jobCreateSchema = z.object({
  body: z
    .object({
      // Core Info (Required for SEO)
      title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title cannot exceed 100 characters'),
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          'Slug must be SEO-friendly (lowercase, numbers, hyphens only)',
        ),
      shortDescription: z
        .string()
        .max(150, 'Short description cannot exceed 150 characters')
        .optional(),
      description: z
        .string()
        .min(50, 'Description must be at least 50 characters'),

      // Company Information (Required for Google Jobs)
      companyName: z
        .string()
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name cannot exceed 100 characters'),
      companyWebsite: z
        .string()
        .url('Company website must be a valid URL')
        .optional()
        .or(z.literal('')),
      companyLogo: z
        .string()
        .url('Company logo must be a valid URL')
        .optional()
        .or(z.literal('')),
      companyIndustry: z.string().optional(),

      // Sector Info
      sector: z.enum(['government', 'non-government', 'ngo', 'public-sector']),

      // Location (Required for Google Jobs)
      location: z.string().min(1, 'Location is required'),
      jobLocation: jobLocationSchema,

      // Salary (Required for Google Jobs in some regions)
      salaryRange: salaryRangeSchema.optional(),
      benefits: z.array(z.string()).optional(),

      // Job Details (Required for Google Jobs)
      employmentType: z.enum([
        'FULL-TIME',
        'PART-TIME',
        'CONTRACTOR',
        'TEMPORARY',
        'INTERN',
        'VOLUNTEER',
        'PER-DIEM',
        'OTHER',
        'remote',
        'internship',
        'freelance',
      ]),
      isRemoteAvailable: z.boolean(),

      // Job Source
      source: z.enum(['own', 'third-party']),
      applyLink: z
        .string()
        .url('Apply link must be a valid URL')
        .optional()
        .or(z.literal('')),
      sourceName: z.string().optional().or(z.literal('')),

      // Recruiter Info (will be set from auth token)
      postedBy: objectIdSchema.optional(),

      // Metadata (Important for SEO)
      experienceLevel: z
        .enum([
          'ENTRY_LEVEL',
          'MID_LEVEL',
          'SENIOR_LEVEL',
          'DIRECTOR',
          'EXECUTIVE',
        ])
        .optional(),
      educationRequired: z.array(z.string()).optional(),
      skillsRequired: z.array(z.string()).optional(),
      requirements: z.array(z.string()).optional(),
      responsibilities: z.array(z.string()).optional(),
      niceToHave: z.array(z.string()).optional(),

      // Application Settings
      applicationDeadline: z
        .string()
        .datetime()
        .optional()
        .or(z.date().optional()),
      applicationMethod: z.enum(['internal', 'external']),
      applyEmail: z
        .string()
        .email('Invalid email format')
        .optional()
        .or(z.literal('')),
      applicationInstructions: z.string().optional(),
      expectedResponseTime: z.string().optional(),
      interviewProcess: z.array(z.string()).optional(),

      // EEO Compliance (Important for Google Policies)
      equalOpportunityStatement: z.string().optional(),
      visaSponsorshipAvailable: z.boolean().optional(),

      // Tracking (will be set automatically)
      applicants: z.array(z.string()).optional(),
      savedBy: z.array(z.string()).optional(),
      viewsCount: z.number().nonnegative().optional(),
      clicksCount: z.number().nonnegative().optional(),

      // Visibility & Monetization
      status: z
        .enum(['active', 'expired', 'draft', 'pending', 'rejected'])
        .default('draft'),
      isFeatured: z.boolean().optional().default(false),
      boostLevel: z
        .enum(['normal', 'featured', 'sponsored'])
        .optional()
        .default('normal'),
      premiumUntil: z.string().datetime().optional().or(z.date().optional()),
      autoRenew: z.boolean().optional().default(false),

      // SEO (Improved structure)
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      canonicalUrl: z
        .string()
        .url('Canonical URL must be valid')
        .optional()
        .or(z.literal('')),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      subcategory: z.string().optional(),
      featuredImage: z
        .string()
        .url('Featured image must be a valid URL')
        .optional()
        .or(z.literal('')),
      ogImage: z
        .string()
        .url('OG image must be a valid URL')
        .optional()
        .or(z.literal('')),
      structuredData: z.record(z.unknown()).optional(),

      // Timestamps (will be set automatically)
      postedAt: z.string().datetime().optional().or(z.date().optional()),
      expiresAt: z.string().datetime().optional().or(z.date().optional()),
      lastUpdatedAt: z.string().datetime().optional().or(z.date().optional()),
    })
    .refine(applyLinkRefinement, {
      message: 'Apply link is required for third-party jobs',
      path: ['applyLink'],
    })
    .refine(sourceNameRefinement, {
      message: 'Source name is required for third party job',
      path: ['sourceName'],
    }),
});

// Create a separate refinement function for expiration date validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expirationDateRefinement = (data: any) => {
  if (
    data.expiresAt &&
    data.postedAt &&
    new Date(data.expiresAt) <= new Date(data.postedAt)
  ) {
    return false;
  }
  return true;
};

// Update Schema (all fields optional)
export const jobUpdateSchema = z.object({
  body: z
    .object({
      // Core Info
      title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .optional(),
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          'Slug must be SEO-friendly (lowercase, numbers, hyphens only)',
        )
        .optional(),
      shortDescription: z
        .string()
        .max(150, 'Short description cannot exceed 150 characters')
        .optional(),
      description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .optional(),

      // Company Information
      companyName: z
        .string()
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name cannot exceed 100 characters')
        .optional(),
      companyWebsite: z
        .string()
        .url('Company website must be a valid URL')
        .optional()
        .or(z.literal('')),
      companyLogo: z
        .string()
        .url('Company logo must be a valid URL')
        .optional()
        .or(z.literal('')),
      companyIndustry: z.string().optional(),

      // Sector Info
      sector: z
        .enum(['government', 'non-government', 'ngo', 'public-sector'])
        .optional(),

      // Location
      location: z.string().min(1, 'Location is required').optional(),
      jobLocation: jobLocationSchema.optional(),

      // Salary
      salaryRange: salaryRangeSchema.optional(),
      benefits: z.array(z.string()).optional(),

      // Job Details
      employmentType: z
        .enum([
          'FULL-TIME',
          'PART-TIME',
          'CONTRACTOR',
          'TEMPORARY',
          'INTERN',
          'VOLUNTEER',
          'PER-DIEM',
          'OTHER',
          'remote',
          'internship',
          'freelance',
        ])
        .optional(),
      isRemoteAvailable: z.boolean().optional(),

      // Job Source
      source: z.enum(['own', 'third-party']).optional(),
      applyLink: z
        .string()
        .url('Apply link must be a valid URL')
        .optional()
        .or(z.literal('')),

      // Metadata
      experienceLevel: z
        .enum([
          'ENTRY_LEVEL',
          'MID_LEVEL',
          'SENIOR_LEVEL',
          'DIRECTOR',
          'EXECUTIVE',
        ])
        .optional(),
      educationRequired: z.array(z.string()).optional(),
      skillsRequired: z.array(z.string()).optional(),
      requirements: z.array(z.string()).optional(),
      responsibilities: z.array(z.string()).optional(),
      niceToHave: z.array(z.string()).optional(),

      // Application Settings
      applicationDeadline: z
        .string()
        .datetime()
        .optional()
        .or(z.date().optional()),
      applicationMethod: z.enum(['internal', 'external']).optional(),
      applyEmail: z
        .string()
        .email('Invalid email format')
        .optional()
        .or(z.literal('')),
      applicationInstructions: z.string().optional(),
      expectedResponseTime: z.string().optional(),
      interviewProcess: z.array(z.string()).optional(),

      // EEO Compliance
      equalOpportunityStatement: z.string().optional(),
      visaSponsorshipAvailable: z.boolean().optional(),

      // Tracking
      applicants: z.array(z.string()).optional(),
      savedBy: z.array(z.string()).optional(),
      viewsCount: z.number().nonnegative().optional(),
      clicksCount: z.number().nonnegative().optional(),

      // Visibility & Monetization
      status: z
        .enum(['active', 'expired', 'draft', 'pending', 'rejected'])
        .optional(),
      isFeatured: z.boolean().optional(),
      boostLevel: z.enum(['normal', 'featured', 'sponsored']).optional(),
      premiumUntil: z.string().datetime().optional().or(z.date().optional()),
      autoRenew: z.boolean().optional(),

      // SEO
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      canonicalUrl: z
        .string()
        .url('Canonical URL must be valid')
        .optional()
        .or(z.literal('')),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      subcategory: z.string().optional(),
      featuredImage: z
        .string()
        .url('Featured image must be a valid URL')
        .optional()
        .or(z.literal('')),
      ogImage: z
        .string()
        .url('OG image must be a valid URL')
        .optional()
        .or(z.literal('')),
      structuredData: z.record(z.unknown()).optional(),

      // Timestamps
      postedAt: z.string().datetime().optional().or(z.date().optional()),
      expiresAt: z.string().datetime().optional().or(z.date().optional()),
      lastUpdatedAt: z.string().datetime().optional().or(z.date().optional()),
    })
    .refine(applyLinkRefinement, {
      message: 'Apply link is required for third-party jobs',
      path: ['applyLink'],
    })
    .refine(expirationDateRefinement, {
      message: 'Expiration date must be after posting date',
      path: ['expiresAt'],
    }),
});

// Type inference from Zod schema
export type JobInput = z.infer<typeof jobCreateSchema>['body'];
export type JobUpdateInput = z.infer<typeof jobUpdateSchema>['body'];

// Validation function for compliance checking
export const validateJobCompliance = (job: JobInput) => {
  const issues: string[] = [];

  // Check for required Google Jobs fields
  if (!job.title) issues.push('Title is required');
  if (!job.description) issues.push('Description is required');
  if (!job.companyName) issues.push('Company name is required');
  if (!job.jobLocation?.addressCountry) issues.push('Country is required');
  if (!job.jobLocation?.addressLocality) issues.push('Locality is required');
  if (!job.applyLink && job.source === 'third-party') {
    issues.push('Apply link is required for third-party jobs');
  }

  // Check for potentially discriminatory content
  const discriminatoryPatterns = [
    /gender|sex|male|female|man|woman|pregnant/i,
    /marital status|marriage|civil partnership/i,
    /race|racial|ethnic|ethnicity|color|national origin|nationality/i,
    /religion|belief|creed/i,
    /age|disability/i,
    /sexual orientation|LGBT|gay|lesbian|bisexual|transgender/i,
  ];

  const contentToCheck = [
    job.description,
    ...(job.requirements || []),
    ...(job.responsibilities || []),
    ...(job.niceToHave || []),
  ]
    .join(' ')
    .toLowerCase();

  discriminatoryPatterns.forEach((pattern) => {
    if (pattern.test(contentToCheck)) {
      issues.push('Content contains potentially discriminatory language');
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
};
