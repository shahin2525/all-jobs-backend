import { RequestHandler } from 'express';

import StatusCodes from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import { ApplicationServices } from './application.service';
import sendResponse from '../../utils/sendResponse';

const createApplication: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user as JwtPayload;
  const result = await ApplicationServices.createApplication(data, user);

  sendResponse(
    res,
    result,
    'Application submitted successfully',
    StatusCodes.CREATED,
  );
});

const getCandidateApplications: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user as JwtPayload;
    const result = await ApplicationServices.getCandidateApplications(user);

    sendResponse(res, result, 'Applications retrieved successfully');
  },
);

const getApplicationsForJob: RequestHandler = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;
  const user = req.user as JwtPayload;
  const result = await ApplicationServices.getApplicationsForJob(jobId, user);

  sendResponse(res, result, 'Job applications retrieved successfully');
});

const updateApplicationStatus: RequestHandler = catchAsync(async (req, res) => {
  const applicationId = req.params.id;
  const { status, notes } = req.body;
  const user = req.user as JwtPayload;

  const result = await ApplicationServices.updateApplicationStatus(
    applicationId,
    status,
    user,
    notes,
  );

  sendResponse(res, result, 'Application status updated successfully');
});

const getApplicationById: RequestHandler = catchAsync(async (req, res) => {
  const applicationId = req.params.id;
  const user = req.user as JwtPayload;

  const result = await ApplicationServices.getApplicationById(
    applicationId,
    user,
  );

  sendResponse(res, result, 'Application retrieved successfully');
});

const deleteApplication: RequestHandler = catchAsync(async (req, res) => {
  const applicationId = req.params.id;
  const user = req.user as JwtPayload;

  await ApplicationServices.deleteApplication(applicationId, user);

  sendResponse(res, null, 'Application deleted successfully');
});

export const ApplicationController = {
  createApplication,
  getCandidateApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  getApplicationById,
  deleteApplication,
};
