// import express from 'express';
// import { JobController } from './job.controller';
// import auth from '../../middlewares/auth';

// import { JobValidation } from './job.validation';
// import validateRequest from '../../middlewares/validateRequest';
// import { USER_ROLE } from '../user/user.const';

// const router = express.Router();

// router.post(
//   '/',
//   auth(USER_ROLE.admin, USER_ROLE.recruiter),
//   validateRequest(JobValidation.jobCreateSchema),
//   JobController.createJob,
// );

// router.get('/', auth(USER_ROLE.admin), JobController.getAllJobs);

// router.get(
//   '/my-jobs',
//   auth(USER_ROLE.admin, USER_ROLE.recruiter),
//   JobController.getMyJobs,
// );

// router.get('/:id', JobController.getSingleJob);

// router.patch(
//   '/:id',
//   auth(USER_ROLE.admin, USER_ROLE.recruiter),
//   validateRequest(JobValidation.jobUpdateSchema),
//   JobController.updateJob,
// );

// router.delete('/:id', auth(USER_ROLE.admin), JobController.deleteJob);

// export const JobRoutes = router;
//
import express, { NextFunction, Request, Response } from 'express';
import { JobController } from './job.controller';
import auth from '../../middlewares/auth';
import { jobCreateSchema, jobUpdateSchema } from './job.validation';

import { USER_ROLE } from '../user/user.const';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.recruiter),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(jobCreateSchema),
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
  validateRequest(jobUpdateSchema),
  JobController.updateJob,
);

router.delete('/:id', auth(USER_ROLE.admin), JobController.deleteJob);

// Optional: Add a compliance check endpoint
// router.post(
//   '/:id/compliance-check',
//   auth(USER_ROLE.admin, USER_ROLE.recruiter),
//   JobController.checkJobCompliance,
// );

export const JobRoutes = router;
