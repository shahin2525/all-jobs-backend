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
exports.JobController = void 0;
const job_validation_1 = require("./job.validation");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const job_service_1 = require("./job.service");
const createJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = job_validation_1.JobValidation.jobCreateSchema.parse(req.body);
        const user = req.user;
        const result = yield job_service_1.JobServices.createJobIntoDB(validatedData.body, user);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Job created successfully',
            statusCode: http_status_codes_1.default.CREATED,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield job_service_1.JobServices.getAllJobsFromDB();
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Jobs retrieved successfully',
            statusCode: http_status_codes_1.default.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield job_service_1.JobServices.getSingleJobFromDB(id);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Job retrieved successfully',
            statusCode: http_status_codes_1.default.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const validatedData = job_validation_1.JobValidation.jobUpdateSchema.parse(req.body);
        const user = req.user;
        const result = yield job_service_1.JobServices.updateJobFromDB(id, validatedData.body, user);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Job updated successfully',
            statusCode: http_status_codes_1.default.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.user;
        const result = yield job_service_1.JobServices.deleteJobFromDB(id, user);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Job deleted successfully',
            statusCode: http_status_codes_1.default.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const result = yield job_service_1.JobServices.getJobsByUserFromDB(user);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'User jobs retrieved successfully',
            statusCode: http_status_codes_1.default.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.JobController = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob,
    getMyJobs,
};
