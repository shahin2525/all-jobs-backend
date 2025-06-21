// application.model.ts
import { Schema, model } from 'mongoose';
import { IApplication } from './application.interface';

const applicationSchema = new Schema<IApplication>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },

    resumeUrl: { type: String, required: true },
    coverLetter: String,
    coverLetterUrl: String,

    status: {
      type: String,
      enum: [
        'pending',
        'reviewed',
        'shortlisted',
        'interviewed',
        'accepted',
        'rejected',
      ],
      default: 'pending',
    },

    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        notes: String,
      },
    ],

    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    viewedAt: Date,
    viewedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    screeningAnswers: [
      {
        question: String,
        answer: String,
      },
    ],

    source: String,
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
  },
);

// Auto-update updatedAt on save
applicationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Application = model<IApplication>(
  'Application',
  applicationSchema,
);
