import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Never returned by default
    role: {
      type: String,
      enum: ['admin', 'recruiter', 'candidate'],
      default: 'candidate',
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'pending'],
      default: 'pending',
    },
    isVerified: { type: Boolean, default: false },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    profile: {
      skills: [{ type: String }],
      company: String,
      avatar: String,
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
