// import { z } from 'zod';
// import validator from 'validator';

// // Helper for password validation
// const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;

// export const TUserValidationSchema = z
//   .object({
//     name: z.object({
//       firstName: z.string().min(2, 'First name too short').max(50),
//       lastName: z.string().min(2, 'Last name too short').max(50),
//     }),
//     email: z
//       .string()
//       .email('Invalid email')
//       .refine(validator.isEmail, 'Invalid email format'), // Extra validation
//     password: z
//       .string()
//       .min(8, 'Password must be 8+ characters')
//       .regex(passwordRegex, 'Requires 1 uppercase, 1 symbol, and 1 number'),
//     phone: z
//       .string()
//       .refine(validator.isMobilePhone, 'Invalid phone number')
//       .optional(),
//     role: z.enum(['admin', 'recruiter', 'candidate']).default('candidate'),
//     isActive: z.boolean().default(true),
//     isVerified: z.boolean().default(false),
//     passwordChangedAt: z.date().optional(),
//     passwordResetToken: z.string().optional(),
//     passwordResetExpires: z.date().optional(),
//     profile: z
//       .object({
//         skills: z.array(z.string().min(1)).optional(),
//         company: z.string().min(2).optional(),
//         avatar: z.string().url('Invalid URL').optional(),
//       })
//       .optional(),
//   })
//   .strict(); // Forbid unknown keys
import { z } from 'zod';
import { USER_ROLE } from './user.const';

// Convert USER_ROLE enum to array of keys
const userRoles = Object.keys(USER_ROLE) as [keyof typeof USER_ROLE];

export const createUserValidationSchema = z.object({
  name: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(userRoles, {
    errorMap: () => ({
      message: 'Role must be admin, recruiter, or candidate',
    }),
  }),
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
});
