import { JobValidation } from './job.validation';
import { IJob } from './job.interface';
import { Job } from './job.model';
import { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';

const createJobIntoDB = async (
  payload: z.infer<typeof JobValidation.jobCreateSchema>['body'],
  user: JwtPayload,
) => {
  const jobData = {
    ...payload,
    postedBy: user._id,
  };
  const result = await Job.create(jobData);
  return result;
};

const getAllJobsFromDB = async () => {
  const result = await Job.find().populate('postedBy');
  return result;
};

const updateJobFromDB = async (
  id: string,
  payload: Partial<IJob>,
  user: JwtPayload,
) => {
  const job = await Job.doesJobExist(id);
  if (!job) {
    throw new Error('Job not found');
  }

  // Check if the user is the owner of the job
  if (job.postedBy!.toString() !== user._id) {
    throw new Error('Unauthorized to update this job');
  }

  const result = await Job.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteJobFromDB = async (id: string, user: JwtPayload) => {
  const job = await Job.doesJobExist(id);
  if (!job) {
    throw new Error('Job not found');
  }

  // Check if the user is the owner of the job
  if (job.postedBy!.toString() !== user._id) {
    throw new Error('Unauthorized to delete this job');
  }

  const result = await Job.findByIdAndDelete(id);
  return result;
};

const getSingleJobFromDB = async (id: string) => {
  const job = await Job.doesJobExist(id);
  if (!job) {
    throw new Error('Job not found');
  }
  const result = await Job.findById(id).populate('postedBy');
  return result;
};

const getJobsByUserFromDB = async (user: JwtPayload) => {
  const result = await Job.find({ postedBy: user._id });
  return result;
};

export const JobServices = {
  createJobIntoDB,
  getAllJobsFromDB,
  updateJobFromDB,
  deleteJobFromDB,
  getSingleJobFromDB,
  getJobsByUserFromDB,
};
