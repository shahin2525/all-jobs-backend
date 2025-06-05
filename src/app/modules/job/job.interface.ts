import { Types } from 'mongoose';

export interface IJob {
  title: string;
  description: string;
  company?: string;
  location?: string;
  source: 'own' | 'third-party';
  isCompliant: boolean;
  applyLink?: string;
  postedBy: Types.ObjectId;
}
