import { Types } from 'mongoose';

export interface IApplication {
  _id?: Types.ObjectId; // Better typing for MongoDB ID

  candidateId: Types.ObjectId; // Reference to User (role: candidate)
  jobId: Types.ObjectId; // Reference to Job

  // Application Content
  resumeUrl: string; // Public URL to resume file (PDF/docx)
  coverLetter?: string; // Optional cover letter text
  coverLetterUrl?: string; // Optional uploaded cover letter file URL

  // Status Tracking
  status:
    | 'pending'
    | 'reviewed'
    | 'shortlisted'
    | 'interviewed'
    | 'accepted'
    | 'rejected';
  statusHistory?: {
    // Track status changes
    status: string;
    changedAt: Date;
    changedBy?: Types.ObjectId; // Admin/recruiter who changed status
    notes?: string;
  }[];

  // Metadata
  appliedAt?: Date; // Auto-set on creation
  updatedAt?: Date; // Auto-updated
  viewedAt?: Date; // When recruiter first viewed
  viewedBy?: Types.ObjectId; // Who viewed it

  // Additional fields
  screeningAnswers?: {
    // For structured application forms
    question: string;
    answer: string;
  }[];
  source?: string; // How they found the job
}
