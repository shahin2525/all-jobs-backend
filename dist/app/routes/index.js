"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const router = (0, express_1.Router)();
const routesModule = [
    { path: '/auth', route: auth_routes_1.AuthRoutes },
    { path: '/users', route: user_routes_1.UserRoutes },
];
routesModule.forEach((route) => router.use(route.path, route.route));
exports.default = router;
