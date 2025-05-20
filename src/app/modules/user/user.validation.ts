import { z } from 'zod';
import validator from 'validator';

// Helper for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;

export const TUserSchema = z
  .object({
    name: z.object({
      firstName: z.string().min(2, 'First name too short').max(50),
      lastName: z.string().min(2, 'Last name too short').max(50),
    }),
    email: z
      .string()
      .email('Invalid email')
      .refine(validator.isEmail, 'Invalid email format'), // Extra validation
    password: z
      .string()
      .min(8, 'Password must be 8+ characters')
      .regex(passwordRegex, 'Requires 1 uppercase, 1 symbol, and 1 number'),
    phone: z
      .string()
      .refine(validator.isMobilePhone, 'Invalid phone number')
      .optional(),
    role: z.enum(['admin', 'recruiter', 'candidate']).default('candidate'),
    status: z.enum(['active', 'blocked', 'pending']).default('pending'),
    isVerified: z.boolean().default(false),
    passwordChangedAt: z.date().optional(),
    passwordResetToken: z.string().optional(),
    passwordResetExpires: z.date().optional(),
    profile: z
      .object({
        skills: z.array(z.string().min(1)).optional(),
        company: z.string().min(2).optional(),
        avatar: z.string().url('Invalid URL').optional(),
      })
      .optional(),
  })
  .strict(); // Forbid unknown keys
