"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_const_1 = require("./user.const");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// 🔓 Public route for registration
router.post('/register', user_controller_1.UserController.createUser);
// 🔐 Protected route: logged-in user info
router.get('/me', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.candidate, user_const_1.USER_ROLE.recruiter), user_controller_1.UserController.getMyProfile);
// 🔐 Protected route: update logged-in user
router.patch('/me', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.candidate, user_const_1.USER_ROLE.recruiter), user_controller_1.UserController.updateMyProfile);
// 🔐 Admin-only routes
router.get('/:id', user_controller_1.UserController.getSingleUser);
router.get('/', (0, auth_1.default)(user_const_1.USER_ROLE.admin), user_controller_1.UserController.getAllUsers);
router.delete('/:id', (0, auth_1.default)(user_const_1.USER_ROLE.admin), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
