import { Types } from 'mongoose';

export interface IJob {
  _id?: string; // ✅ Good for MongoDB

  // Core Job Info
  title: string;
  description: string;
  company: string;
  location: string;

  // Salary (Improved)
  salaryRange?: {
    min: number;
    max: number;
    currency?: string; // ✅ Add currency (USD, EUR, etc.)
    //isDisclosed?: boolean; // ✅ "Salary negotiable" or "Not disclosed"
  };

  // Job Type (Enhanced)
  employmentType:
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'remote'
    | 'internship'
    | 'freelance'; // ✅ Added 'freelance'

  // Job Source (Good!)
  source: 'own' | 'third-party';
  applyLink?: string; // ✅ Required for third-party jobs

  // Recruiter Info (Clarified)
  postedBy?: Types.ObjectId;

  // Job Metadata (Optional but Useful)
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead'; // ✅ Filter jobs by seniority
  educationRequired?: string[]; // ✅ E.g., ["Bachelor's", "Master's"]
  skillsRequired?: string[]; // ✅ Better than generic "tags"

  // Applicants Tracking
  applicants?: string[]; // User _ids who applied
  savedBy?: string[]; // ✅ User _ids who saved/bookmarked the job

  // Timestamps (Good!)
  postedAt?: Date; // ✅ Separate from createdAt (e.g., job reposted)
  expiresAt?: Date; // ✅ Auto-archive expired jobs
}

import { Model } from 'mongoose';

export interface IJobModel extends Model<IJob> {
  // eslint-disable-next-line no-unused-vars
  doesJobExist(id: string): Promise<IJob | null>;
}
