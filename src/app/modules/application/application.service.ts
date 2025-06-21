import { IApplication } from './application.interface';
import { Application } from './application.model';
import { Types } from 'mongoose';

import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { Job } from '../job/job.model';
import { User } from '../user/user.model';
import AppError from '../../errors/appError';

const createApplication = async (
  applicationData: IApplication,
  candidate: JwtPayload,
): Promise<IApplication> => {
  // Verify the candidate exists
  const isCandidateExist = await User.findById(candidate.userId);
  if (!isCandidateExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Candidate not found');
  }

  // Verify the job exists
  const isJobExist = await Job.findById(applicationData.jobId);
  if (!isJobExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  // Check if already applied
  const alreadyApplied = await Application.findOne({
    candidateId: candidate.userId,
    jobId: applicationData.jobId,
  });
  if (alreadyApplied) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already applied to this job');
  }

  const newApplication = await Application.create({
    ...applicationData,
    candidateId: candidate.userId,
  });

  return newApplication;
};

const getCandidateApplications = async (
  candidate: JwtPayload,
): Promise<IApplication[]> => {
  const applications = await Application.find({ candidateId: candidate.userId })
    .populate('jobId')
    .sort({ appliedAt: -1 });

  return applications;
};

const getApplicationsForJob = async (
  jobId: string,
  user: JwtPayload,
): Promise<IApplication[]> => {
  // Verify the user owns the job or is admin
  const job = await Job.findOne({ _id: jobId, postedBy: user.userId });
  if (!job && user.role !== 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Not authorized to view these applications',
    );
  }

  const applications = await Application.find({ jobId })
    .populate('candidateId')
    .sort({ appliedAt: -1 });

  return applications;
};

const updateApplicationStatus = async (
  applicationId: string,
  status: string,
  user: JwtPayload,
  notes?: string,
): Promise<IApplication> => {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }

  // Verify the user owns the job or is admin
  const job = await Job.findOne({
    _id: application.jobId,
    postedBy: user.userId,
  });
  if (!job && user.role !== 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Not authorized to update this application',
    );
  }

  // Update status and history
  const updatedApplication = await Application.findByIdAndUpdate(
    applicationId,
    {
      status,
      $push: {
        statusHistory: {
          status,
          changedBy: user.userId,
          notes,
        },
      },
    },
    { new: true },
  ).populate('candidateId jobId');

  if (!updatedApplication) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update application',
    );
  }

  return updatedApplication;
};

const getApplicationById = async (
  applicationId: string,
  user: JwtPayload,
): Promise<IApplication> => {
  const application =
    await Application.findById(applicationId).populate('candidateId jobId');

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }

  // Verify access - candidate, job poster, or admin
  if (
    application.candidateId._id.toString() !== user.userId &&
    user.role !== 'admin'
  ) {
    const isJobPoster = await Job.exists({
      _id: application.jobId,
      postedBy: user.userId,
    });
    if (!isJobPoster) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Not authorized to view this application',
      );
    }
  }

  // Track view if recruiter/admin is viewing
  if (user.role !== 'candidate') {
    application.viewedAt = new Date();
    application.viewedBy = new Types.ObjectId(user.userId);
    await application.save();
  }

  return application;
};

const deleteApplication = async (
  applicationId: string,
  user: JwtPayload,
): Promise<void> => {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }

  // Only candidate or admin can delete
  if (
    application.candidateId.toString() !== user.userId &&
    user.role !== 'admin'
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Not authorized to delete this application',
    );
  }

  await Application.findByIdAndDelete(applicationId);
};

export const ApplicationServices = {
  createApplication,
  getCandidateApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  getApplicationById,
  deleteApplication,
};
