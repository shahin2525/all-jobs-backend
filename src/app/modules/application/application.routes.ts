import express from 'express';
import { ApplicationController } from './application.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ApplicationValidation } from './application.validation';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

// Apply for a job (Candidate only)
router.post(
  '/',
  auth(USER_ROLE.candidate),
  validateRequest(ApplicationValidation.createApplicationSchema),
  ApplicationController.createApplication,
);

// Get my applications (Candidate only)
router.get(
  '/my-applications',
  auth(USER_ROLE.candidate),
  ApplicationController.getCandidateApplications,
);

// Get applications for a specific job (Recruiter/Admin)
router.get(
  '/job/:jobId',
  auth(USER_ROLE.recruiter, USER_ROLE.admin),
  ApplicationController.getApplicationsForJob,
);

// Update application status (Recruiter/Admin)
router.patch(
  '/:id/status',
  auth(USER_ROLE.recruiter, USER_ROLE.admin),
  validateRequest(ApplicationValidation.updateApplicationStatusSchema),
  ApplicationController.updateApplicationStatus,
);

// Get application details (Candidate/Recruiter/Admin)
router.get(
  '/:id',
  auth(USER_ROLE.candidate, USER_ROLE.recruiter, USER_ROLE.admin),
  ApplicationController.getApplicationById,
);

// Delete application (Candidate or Admin)
router.delete(
  '/:id',
  auth(USER_ROLE.candidate, USER_ROLE.admin),
  ApplicationController.deleteApplication,
);

export const ApplicationRoutes = router;
