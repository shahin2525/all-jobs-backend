import express from 'express';
import { JobController } from './job.controller';
import auth from '../../middlewares/auth';

import { JobValidation } from './job.validation';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.recruiter),
  validateRequest(JobValidation.jobCreateSchema),
  JobController.createJob,
);

router.get('/', JobController.getAllJobs);

router.get(
  '/my-jobs',
  auth(USER_ROLE.admin, USER_ROLE.recruiter),
  JobController.getMyJobs,
);

router.get('/:id', JobController.getSingleJob);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.recruiter),
  validateRequest(JobValidation.jobUpdateSchema),
  JobController.updateJob,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.recruiter),
  JobController.deleteJob,
);

export const JobRoutes = router;
