import express from 'express';
import { UserController } from './user.controller';
import { decodeToken } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';

const router = express.Router();

// 🔓 Public route for registration
router.post('/register', UserController.createUser);

// 🔐 Protected route: logged-in user info
router.get('/me', decodeToken, UserController.getMyProfile);

// 🔐 Protected route: update logged-in user
router.patch('/me', decodeToken, UserController.updateMyProfile);

// 🔐 Admin-only routes
router.get(
  '/:id',
  decodeToken,
  authorizeRoles('admin'),
  UserController.getSingleUser,
);
router.get(
  '/',
  decodeToken,
  authorizeRoles('admin'),
  UserController.getAllUsers,
);
router.delete(
  '/:id',
  decodeToken,
  authorizeRoles('admin'),
  UserController.deleteUser,
);

export const UserRoutes = router;
