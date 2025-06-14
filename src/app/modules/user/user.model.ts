import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

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
    isActive: {
      type: Boolean,

      default: true,
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Set passwordChangedAt if it's not a new user
    if (!this.isNew) {
      this.passwordChangedAt = new Date(Date.now() - 1000); // Subtract 1 second to ensure token was created after password change
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare entered password with hashed password in database
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if password was changed after a given timestamp (for JWT)
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

export const User = model('User', userSchema);
