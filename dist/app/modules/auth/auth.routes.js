"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_controller_1 = require("./auth.controller");
const user_const_1 = require("../user/user.const");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.AuthControllers.loginUser);
router.post('/change-password', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.candidate, user_const_1.USER_ROLE.recruiter), auth_controller_1.AuthControllers.changePassword);
router.post('/refresh-token', auth_controller_1.AuthControllers.refreshToken);
router.post('/forget-password', auth_controller_1.AuthControllers.forgetPassword);
router.post('/reset-password', auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
