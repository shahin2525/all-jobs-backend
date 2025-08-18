"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const application_validation_1 = require("./application.validation");
const user_const_1 = require("../user/user.const");
const router = express_1.default.Router();
// Apply for a job (Candidate only)
router.post('/', (0, auth_1.default)(user_const_1.USER_ROLE.candidate), (0, validateRequest_1.default)(application_validation_1.ApplicationValidation.createApplicationSchema), application_controller_1.ApplicationController.createApplication);
// Get my applications (Candidate only)
router.get('/my-applications', (0, auth_1.default)(user_const_1.USER_ROLE.candidate), application_controller_1.ApplicationController.getCandidateApplications);
// Get applications for a specific job (Recruiter/Admin)
router.get('/job/:jobId', (0, auth_1.default)(user_const_1.USER_ROLE.recruiter, user_const_1.USER_ROLE.admin), application_controller_1.ApplicationController.getApplicationsForJob);
// Update application status (Recruiter/Admin)
router.patch('/:id/status', (0, auth_1.default)(user_const_1.USER_ROLE.recruiter, user_const_1.USER_ROLE.admin), (0, validateRequest_1.default)(application_validation_1.ApplicationValidation.updateApplicationStatusSchema), application_controller_1.ApplicationController.updateApplicationStatus);
// Get application details (Candidate/Recruiter/Admin)
router.get('/:id', (0, auth_1.default)(user_const_1.USER_ROLE.candidate, user_const_1.USER_ROLE.recruiter, user_const_1.USER_ROLE.admin), application_controller_1.ApplicationController.getApplicationById);
// Delete application (Candidate or Admin)
router.delete('/:id', (0, auth_1.default)(user_const_1.USER_ROLE.candidate, user_const_1.USER_ROLE.admin), application_controller_1.ApplicationController.deleteApplication);
exports.ApplicationRoutes = router;
