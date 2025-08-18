"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const application_service_1 = require("./application.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = req.user;
    const result = yield application_service_1.ApplicationServices.createApplication(data, user);
    (0, sendResponse_1.default)(res, result, 'Application submitted successfully', http_status_codes_1.default.CREATED);
}));
const getCandidateApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield application_service_1.ApplicationServices.getCandidateApplications(user);
    (0, sendResponse_1.default)(res, result, 'Applications retrieved successfully');
}));
const getApplicationsForJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const user = req.user;
    const result = yield application_service_1.ApplicationServices.getApplicationsForJob(jobId, user);
    (0, sendResponse_1.default)(res, result, 'Job applications retrieved successfully');
}));
const updateApplicationStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = req.params.id;
    const { status, notes } = req.body;
    const user = req.user;
    const result = yield application_service_1.ApplicationServices.updateApplicationStatus(applicationId, status, user, notes);
    (0, sendResponse_1.default)(res, result, 'Application status updated successfully');
}));
const getApplicationById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = req.params.id;
    const user = req.user;
    const result = yield application_service_1.ApplicationServices.getApplicationById(applicationId, user);
    (0, sendResponse_1.default)(res, result, 'Application retrieved successfully');
}));
const deleteApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = req.params.id;
    const user = req.user;
    yield application_service_1.ApplicationServices.deleteApplication(applicationId, user);
    (0, sendResponse_1.default)(res, null, 'Application deleted successfully');
}));
exports.ApplicationController = {
    createApplication,
    getCandidateApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    getApplicationById,
    deleteApplication,
};
