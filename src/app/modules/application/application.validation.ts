import { z } from 'zod';

const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    resumeUrl: z
      .string()
      .url('Invalid resume URL')
      .min(1, 'Resume is required'),
    coverLetter: z.string().optional(),
  }),
});

const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'pending',
      'reviewed',
      'shortlisted',
      'interviewed',
      'accepted',
      'rejected',
    ]),
    notes: z.string().optional(),
  }),
});

export const ApplicationValidation = {
  createApplicationSchema,
  updateApplicationStatusSchema,
};
