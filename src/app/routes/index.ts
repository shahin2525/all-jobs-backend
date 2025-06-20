import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
const router = Router();
const routesModule = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
];

routesModule.forEach((route) => router.use(route.path, route.route));
export default router;
