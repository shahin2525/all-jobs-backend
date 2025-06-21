// import { model, Schema } from 'mongoose';
// import { IJob } from './job.interface';

// const JobSchema = new Schema<IJob>(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     company: String,
//     location: String,
//     source: { type: String, enum: ['own', 'third-party'], default: 'own' },
//     isCompliant: { type: Boolean, default: true },
//     applyLink: String,
//     postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
//   },
//   { timestamps: true },
// );

// export const Job = model<IJob>('Job', JobSchema);
import { Schema, model } from 'mongoose';
import { IJob, IJobModel } from './job.interface'; // Your interface file

// Define the schema
const JobSchema = new Schema<IJob, IJobModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },

    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' }, // Default to USD
    },

    employmentType: {
      type: String,
      required: true,
      enum: [
        'full-time',
        'part-time',
        'contract',
        'remote',
        'internship',
        'freelance',
      ],
    },

    source: {
      type: String,
      required: true,
      enum: ['own', 'third-party'],
    },
    applyLink: { type: String }, // Required if source=third-party

    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model

    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
    },
    educationRequired: [{ type: String }], // Array of strings
    skillsRequired: [{ type: String }], // Array of skills

    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // User IDs who applied
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // User IDs who bookmarked

    postedAt: { type: Date, default: Date.now }, // Auto-set on creation
    expiresAt: { type: Date }, // Manual/auto expiry date
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

//
// Add to your JobSchema methods
JobSchema.statics.doesJobExist = async function (id: string) {
  const job = await this.findById(id);
  return job;
};

// Create and export the model
export const Job = model<IJob, IJobModel>('Job', JobSchema);
