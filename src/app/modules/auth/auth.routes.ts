import express from 'express';
import auth from '../../middlewares/auth';
import { AuthControllers } from './auth.controller';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.candidate, USER_ROLE.recruiter),

  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',

  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',

  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',

  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
