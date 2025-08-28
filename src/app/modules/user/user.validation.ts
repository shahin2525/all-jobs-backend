import { z } from 'zod';
import { USER_ROLE } from './user.const';

// Convert USER_ROLE enum to array of keys
const userRoles = Object.keys(USER_ROLE) as [keyof typeof USER_ROLE];

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().optional(),
    }),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    role: z
      .enum(userRoles, {
        errorMap: () => ({
          message: 'Role must be admin, recruiter, or candidate',
        }),
      })
      .default('candidate'),
    isActive: z.boolean().default(true),
    isVerified: z.boolean().default(false),
    lastLogin: z.date().optional(),
    passwordChangedAt: z.date().optional(),
    passwordResetToken: z.string().optional(),
    passwordResetExpires: z.date().optional(),
    profile: z
      .object({
        skills: z.array(z.string()).optional(),
        company: z.string().optional(),
        avatar: z.string().url('Avatar must be a valid URL').optional(),
      })
      .optional(),
    createdAt: z.date().optional(), // Usually set from backend
    updatedAt: z.date().optional(), // Usually set from backend
  }),
});
