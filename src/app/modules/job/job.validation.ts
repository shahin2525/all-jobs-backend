import { z } from 'zod';
import { Types } from 'mongoose';

// Helper schema for MongoDB ObjectId validation
const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
  });

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().optional(),
  location: z.string().optional(),
  source: z.enum(['own', 'third-party']),
  isCompliant: z.boolean(),
  applyLink: z.string().url('Invalid URL format').optional(),
  postedBy: objectIdSchema,
});

// You can also create a type from the schema if needed
export type JobInput = z.infer<typeof jobSchema>;
