import { RequestHandler } from 'express';

import { JobValidation } from './job.validation';
import StatusCodes from 'http-status-codes';
import { JobServices } from './job.service';

const createJob: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = JobValidation.jobCreateSchema.parse(req.body);
    const user = req.user;

    const result = await JobServices.createJobIntoDB(validatedData.body, user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Job created successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllJobs: RequestHandler = async (req, res, next) => {
  try {
    const result = await JobServices.getAllJobsFromDB();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Jobs retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleJob: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await JobServices.getSingleJobFromDB(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Job retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateJob: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = JobValidation.jobUpdateSchema.parse(req.body);
    const user = req.user;

    const result = await JobServices.updateJobFromDB(
      id,
      validatedData.body,
      user,
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Job updated successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const result = await JobServices.deleteJobFromDB(id, user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Job deleted successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyJobs: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await JobServices.getJobsByUserFromDB(user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User jobs retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const JobController = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getMyJobs,
};
