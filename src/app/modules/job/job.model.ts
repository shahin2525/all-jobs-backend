import { Schema, model } from 'mongoose';
import { IJob, IJobModel } from './job.interface';

const JobSchema = new Schema<IJob, IJobModel>(
  {
    // Core Info (Required for SEO)
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      maxlength: 150,
      trim: true,
    },
    description: { type: String, required: true },

    // Company Information
    companyName: { type: String, required: true, trim: true },
    companyWebsite: { type: String, trim: true },
    companyLogo: { type: String, trim: true },
    companyIndustry: { type: String, trim: true },

    // Sector Info
    sector: {
      type: String,
      required: true,
      enum: ['government', 'non-government', 'ngo', 'public-sector'],
    },

    // Location Information
    location: { type: String, required: true, trim: true },
    jobLocation: {
      addressCountry: { type: String, required: true, trim: true },
      addressRegion: { type: String, trim: true },
      addressLocality: { type: String, required: true, trim: true },
      postalCode: { type: String, trim: true },
      streetAddress: { type: String, trim: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    // Salary Information
    salaryRange: {
      min: {
        type: Number,
        required: function () {
          return this.salaryRange !== undefined;
        },
      },
      max: {
        type: Number,
        required: function () {
          return this.salaryRange !== undefined;
        },
      },
      currency: {
        type: String,
        required: function () {
          return this.salaryRange !== undefined;
        },
        default: 'USD',
      },
      unitText: {
        type: String,
        enum: ['MONTH', 'HOUR', 'YEAR', 'DAY'],
        required: function () {
          return this.salaryRange !== undefined;
        },
      },
    },
    benefits: [{ type: String, trim: true }],

    // Job Details
    employmentType: {
      type: String,
      required: true,
      enum: [
        'FULL-TIME',
        'PART-TIME',
        'CONTRACTOR',
        'TEMPORARY',
        'INTERN',
        'VOLUNTEER',
        'PER-DIEM',
        'OTHER',
        'remote',
        'internship',
        'freelance',
      ],
    },
    isRemoteAvailable: { type: Boolean, required: true, default: false },

    // Job Source
    source: {
      type: String,
      required: true,
      enum: ['own', 'third-party'],
    },
    applyLink: {
      type: String,
      required: function () {
        return this.source === 'third-party';
      },
      trim: true,
    },

    // Recruiter Info
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // Metadata
    experienceLevel: {
      type: String,
      enum: [
        'ENTRY_LEVEL',
        'MID_LEVEL',
        'SENIOR_LEVEL',
        'DIRECTOR',
        'EXECUTIVE',
      ],
    },
    educationRequired: [{ type: String, trim: true }],
    skillsRequired: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    niceToHave: [{ type: String, trim: true }],

    // Application Settings
    applicationDeadline: { type: Date },
    applicationMethod: {
      type: String,
      required: true,
      enum: ['internal', 'external'],
      default: 'internal',
    },
    applyEmail: { type: String, trim: true },
    applicationInstructions: { type: String, trim: true },
    expectedResponseTime: { type: String, trim: true },
    interviewProcess: [{ type: String, trim: true }],

    // EEO Compliance
    equalOpportunityStatement: { type: String, trim: true },
    visaSponsorshipAvailable: { type: Boolean, default: false },

    // Tracking
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewsCount: { type: Number, default: 0 },
    clicksCount: { type: Number, default: 0 },

    // Visibility & Monetization
    status: {
      type: String,
      required: true,
      enum: ['active', 'expired', 'draft', 'pending', 'rejected'],
      default: 'draft',
    },
    isFeatured: { type: Boolean, default: false },
    boostLevel: {
      type: String,
      enum: ['normal', 'featured', 'sponsored'],
      default: 'normal',
    },
    premiumUntil: { type: Date },
    autoRenew: { type: Boolean, default: false },

    // SEO
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true },
    subcategory: { type: String, trim: true },
    featuredImage: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    structuredData: { type: Schema.Types.Mixed },

    // Timestamps
    postedAt: { type: Date, default: Date.now, required: true },
    expiresAt: { type: Date, required: true },
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/** ✅ Indexes for Performance **/
// Full-text index for search
JobSchema.index(
  {
    title: 'text',
    shortDescription: 'text',
    description: 'text',
    skillsRequired: 'text',
    companyName: 'text',
  },
  {
    weights: {
      title: 10,
      shortDescription: 5,
      skillsRequired: 5,
      description: 2,
      companyName: 3,
    },
    name: 'JobTextIndex',
  },
);

// Compound indexes for filtering & sorting
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({
  sector: 1,
  employmentType: 1,
  'jobLocation.addressLocality': 1,
});
JobSchema.index({ companyName: 1 });
JobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/** ✅ Middleware: Auto-generate SEO slug **/
JobSchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

/** ✅ Virtual: isExpired **/
JobSchema.virtual('isExpired').get(function () {
  return this.expiresAt < new Date();
});

/** ✅ Middleware: Update lastUpdatedAt **/
JobSchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

/** ✅ Static Methods **/
JobSchema.statics.doesJobExist = async function (id: string) {
  return this.findById(id);
};

JobSchema.statics.isJobCompliant = async function (job: IJob) {
  const issues: string[] = [];

  if (!job.title) issues.push('Title is required');
  if (!job.description) issues.push('Description is required');
  if (!job.companyName) issues.push('Company name is required');
  if (!job.jobLocation?.addressCountry) issues.push('Country is required');
  if (!job.jobLocation?.addressLocality) issues.push('Locality is required');
  if (!job.applyLink && job.source === 'third-party')
    issues.push('Apply link is required for third-party jobs');

  const discriminatoryTerms = [
    /gender|sex|male|female|man|woman|pregnant|marital status|marriage|civil partnership|race|racial|ethnic|ethnicity|color|national origin|nationality|religion|belief|creed|age|disability|sexual orientation|LGBT|gay|lesbian|bisexual|transgender/i,
  ];

  const description =
    job.description + ' ' + (job.requirements?.join(' ') || '');
  discriminatoryTerms.forEach((term) => {
    if (term.test(description)) {
      issues.push(
        'Job description contains potentially discriminatory language',
      );
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
};

export const Job = model<IJob, IJobModel>('Job', JobSchema);
