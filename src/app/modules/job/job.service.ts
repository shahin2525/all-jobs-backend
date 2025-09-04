/* eslint-disable @typescript-eslint/no-explicit-any */

import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { IJob } from './job.interface';
import { Job } from './job.model';
import { JwtPayload } from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';
// const createJobIntoDB = async (file: any, payload: IJob, user: JwtPayload) => {
//   const imageName = `${payload?.companyName}${user?.userId}`;
//   const path = file?.path;
//   //send image to cloudinary
//   const { secure_url } = await sendImageToCloudinary(imageName, path);
//   const jobData = {
//     ...payload,
//     postedBy: user?.userId,
//     companyLogo: secure_url,
//   };

//   // console.log(jobData);
//   const result = await Job.create(jobData);
//   return result;
// };

// const getAllJobsFromDB = async () => {
//   const result = await Job.find().populate('postedBy');
//   return result;
// };
const createJobIntoDB = async (file: any, payload: IJob, user: JwtPayload) => {
  let secureUrl = '';
  console.log('file', file);
  if (file?.path) {
    const imageName = `${payload?.companyName}-${user?.userId}`;
    const { secure_url } = await sendImageToCloudinary(imageName, file.path);
    secureUrl = secure_url;
    console.log('secure', secureUrl);
  }

  const jobData = {
    ...payload,
    postedBy: user?.userId,
    companyLogo: secureUrl, // ✅ Fallback if no file
  };

  const result = await Job.create(jobData);
  return result;
};
interface IQueryOptions {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, unknown>;
}

const getAllJobsFromDB = async (options: IQueryOptions) => {
  const { search, sort, page = 1, limit = 10, filters = {} } = options;

  // ✅ 1. Build Mongoose query object
  const query: FilterQuery<typeof Job> = {};

  // ✅ Search (full-text index)
  if (search) {
    query.$text = { $search: search };
  }

  // ✅ Filtering
  if (filters.sector) query.sector = filters.sector;
  if (filters.employmentType) query.employmentType = filters.employmentType;
  if (filters.location)
    query.location = { $regex: filters.location, $options: 'i' };
  if (filters.status) query.status = filters.status;

  // ✅ Pagination
  const skip = (page - 1) * limit;

  // ✅ Sorting
  let sortQuery: Record<string, 1 | -1> = { postedAt: -1 }; // Default: latest jobs first
  if (sort) {
    if (sort === 'salary-asc') sortQuery = { 'salaryRange.min': 1 };
    if (sort === 'salary-desc') sortQuery = { 'salaryRange.max': -1 };
    if (sort === 'recent') sortQuery = { postedAt: -1 };
  }

  // ✅ Execute query
  const jobs = await Job.find(query)
    .populate('postedBy', 'name email') // Only populate necessary fields
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  // ✅ Count total for pagination meta
  const total = await Job.countDocuments(query);

  return {
    data: jobs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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
  if (user?.role !== 'admin' && job?.postedBy?.toString() !== user?.userId) {
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
  if (user?.role !== 'admin' && job?.postedBy?.toString() !== user?.userId) {
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
