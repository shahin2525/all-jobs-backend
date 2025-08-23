import { Model, Types } from 'mongoose';

export interface IJob {
  // Core Info (Required for SEO)
  title: string;
  slug: string; // SEO-friendly URL
  shortDescription?: string; // 150 chars for previews
  description: string;

  // Company Information (Required for Google Jobs)
  companyName: string;
  companyWebsite?: string;
  companyLogo?: string;
  companyIndustry?: string; // Moved from bottom for better organization

  // Sector Info
  sector: 'government' | 'non-government' | 'ngo' | 'public-sector';

  // Location (Required for Google Jobs)
  location: string;
  jobLocation: {
    // Made required for Google Jobs compliance
    addressCountry: string;
    addressRegion?: string;
    addressLocality: string;
    postalCode?: string;
    streetAddress?: string;
    latitude?: number; // Added for better geotargeting
    longitude?: number; // Added for better geotargeting
  };

  // Salary (Required for Google Jobs in some regions)
  salaryRange?: {
    min: number;
    max: number;
    currency: string; // Made required if salaryRange exists
    unitText: 'MONTH' | 'HOUR' | 'YEAR' | 'DAY'; // Added for structured data compliance
  };
  benefits?: string[];

  // Job Details (Required for Google Jobs)
  employmentType:
    | 'FULL_TIME' // Changed to match Schema.org convention
    | 'PART_TIME'
    | 'CONTRACTOR'
    | 'TEMPORARY'
    | 'INTERN'
    | 'VOLUNTEER'
    | 'PER_DIEM'
    | 'OTHER';
  isRemoteAvailable: boolean; // Made required

  // Job Source
  source: 'own' | 'third-party';
  applyLink: string; // Made required for external applications

  // Recruiter Info
  postedBy: Types.ObjectId;

  // Metadata (Important for SEO)
  experienceLevel?:
    | 'ENTRY_LEVEL'
    | 'MID_LEVEL'
    | 'SENIOR_LEVEL'
    | 'DIRECTOR'
    | 'EXECUTIVE'; // Standardized
  educationRequired?: string[];
  skillsRequired?: string[];
  requirements?: string[];
  responsibilities?: string[];
  niceToHave?: string[];

  // Application Settings
  applicationDeadline?: Date;
  applicationMethod: 'internal' | 'external'; // Made required
  applyEmail?: string;
  applicationInstructions?: string;
  expectedResponseTime?: string;
  interviewProcess?: string[];

  // EEO Compliance (Important for Google Policies)
  equalOpportunityStatement?: string;
  visaSponsorshipAvailable?: boolean;

  // Tracking
  applicants?: string[];
  savedBy?: string[];
  viewsCount?: number;
  clicksCount?: number;

  // Visibility & Monetization
  status: 'active' | 'expired' | 'draft' | 'pending' | 'rejected'; // Added rejected status
  isFeatured?: boolean;
  boostLevel?: 'normal' | 'featured' | 'sponsored';
  premiumUntil?: Date;
  autoRenew?: boolean;

  // SEO (Improved structure)
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  tags?: string[];
  category?: string;
  subcategory?: string;
  featuredImage?: string;
  ogImage?: string;
  structuredData?: Record<string, unknown>; // Changed to object for better handling

  // Timestamps
  postedAt: Date; // Made required
  expiresAt: Date; // Made required
  lastUpdatedAt?: Date; // Added for content freshness
}

export interface IJobModel extends Model<IJob> {
  // eslint-disable-next-line no-unused-vars
  doesJobExist(id: string): Promise<IJob | null>;
  // eslint-disable-next-line no-unused-vars
  isJobCompliant(job: IJob): Promise<{ compliant: boolean; issues: string[] }>;
}
