import { USER_ROLE } from './user.const';

export type TUser = {
  // _id?: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string; // Will be hashed
  phone?: string; // Optional for contact
  role: 'admin' | 'recruiter' | 'candidate'; // Renamed 'employee' to 'candidate'
  isActive: boolean; // Added 'pending' for email verification
  isVerified: boolean; // Better than isDeleted for GDPR compliance
  lastLogin?: Date;
  passwordChangedAt?: Date; // Renamed for clarity
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profile?: {
    skills?: string[]; // For candidates
    company?: string; // For recruiters
    avatar?: string; // URL to image
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserUpdateRequest = Partial<TUser> & {
  firstName?: string;
  lastName?: string;
  skills?: string[];
  company?: string;
  avatar?: string;
};
export type TUserRole = keyof typeof USER_ROLE;
