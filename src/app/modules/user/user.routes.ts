import express from 'express';
import { UserController } from './user.controller';

import { USER_ROLE } from './user.const';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createUserValidationSchema } from './user.validation';

const router = express.Router();

// 🔓 Public route for registration
router.post(
  '/register',
  validateRequest(createUserValidationSchema),
  UserController.createUser,
);

// 🔐 Protected route: logged-in user info
router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.candidate, USER_ROLE.recruiter),
  UserController.getMyProfile,
);

// 🔐 Protected route: update logged-in user
router.patch(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.candidate, USER_ROLE.recruiter),
  UserController.updateMyProfile,
);

// 🔐 Admin-only routes
router.get(
  '/:id',

  UserController.getSingleUser,
);
router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);
router.delete('/:id', auth(USER_ROLE.admin), UserController.deleteUser);

export const UserRoutes = router;
