import { model, Schema } from 'mongoose';
import { IJob } from './job.interface';

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: String,
    location: String,
    source: { type: String, enum: ['own', 'third-party'], default: 'own' },
    isCompliant: { type: Boolean, default: true },
    applyLink: String,
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const Job = model<IJob>('Job', JobSchema);
