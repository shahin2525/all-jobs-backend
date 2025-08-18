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
exports.ApplicationServices = void 0;
const application_model_1 = require("./application.model");
const mongoose_1 = require("mongoose");
const job_model_1 = require("../job/job.model");
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const createApplication = (applicationData, candidate) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify the candidate exists
    const isCandidateExist = yield user_model_1.User.findById(candidate.userId);
    if (!isCandidateExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Candidate not found');
    }
    // Verify the job exists
    const isJobExist = yield job_model_1.Job.findById(applicationData.jobId);
    if (!isJobExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Job not found');
    }
    // Check if already applied
    const alreadyApplied = yield application_model_1.Application.findOne({
        candidateId: candidate.userId,
        jobId: applicationData.jobId,
    });
    if (alreadyApplied) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Already applied to this job');
    }
    const newApplication = yield application_model_1.Application.create(Object.assign(Object.assign({}, applicationData), { candidateId: candidate.userId }));
    return newApplication;
});
const getCandidateApplications = (candidate) => __awaiter(void 0, void 0, void 0, function* () {
    const applications = yield application_model_1.Application.find({ candidateId: candidate.userId })
        .populate('jobId')
        .sort({ appliedAt: -1 });
    return applications;
});
const getApplicationsForJob = (jobId, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify the user owns the job or is admin
    const job = yield job_model_1.Job.findOne({ _id: jobId, postedBy: user.userId });
    if (!job && user.role !== 'admin') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Not authorized to view these applications');
    }
    const applications = yield application_model_1.Application.find({ jobId })
        .populate('candidateId')
        .sort({ appliedAt: -1 });
    return applications;
});
const updateApplicationStatus = (applicationId, status, user, notes) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_model_1.Application.findById(applicationId);
    if (!application) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Application not found');
    }
    // Verify the user owns the job or is admin
    const job = yield job_model_1.Job.findOne({
        _id: application.jobId,
        postedBy: user.userId,
    });
    if (!job && user.role !== 'admin') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Not authorized to update this application');
    }
    // Update status and history
    const updatedApplication = yield application_model_1.Application.findByIdAndUpdate(applicationId, {
        status,
        $push: {
            statusHistory: {
                status,
                changedBy: user.userId,
                notes,
            },
        },
    }, { new: true }).populate('candidateId jobId');
    if (!updatedApplication) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update application');
    }
    return updatedApplication;
});
const getApplicationById = (applicationId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_model_1.Application.findById(applicationId).populate('candidateId jobId');
    if (!application) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Application not found');
    }
    // Verify access - candidate, job poster, or admin
    if (application.candidateId._id.toString() !== user.userId &&
        user.role !== 'admin') {
        const isJobPoster = yield job_model_1.Job.exists({
            _id: application.jobId,
            postedBy: user.userId,
        });
        if (!isJobPoster) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Not authorized to view this application');
        }
    }
    // Track view if recruiter/admin is viewing
    if (user.role !== 'candidate') {
        application.viewedAt = new Date();
        application.viewedBy = new mongoose_1.Types.ObjectId(user.userId);
        yield application.save();
    }
    return application;
});
const deleteApplication = (applicationId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_model_1.Application.findById(applicationId);
    if (!application) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Application not found');
    }
    // Only candidate or admin can delete
    if (application.candidateId.toString() !== user.userId &&
        user.role !== 'admin') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Not authorized to delete this application');
    }
    yield application_model_1.Application.findByIdAndDelete(applicationId);
});
const getRecruiterJobApplications = (recruiterId) => __awaiter(void 0, void 0, void 0, function* () {
    const applications = yield application_model_1.Application.find()
        .populate({
        path: 'jobId',
        match: { postedBy: recruiterId },
    })
        .populate('candidateId');
    // Filter only jobs that belong to this recruiter
    return applications.filter((app) => app.jobId !== null);
});
exports.ApplicationServices = {
    getRecruiterJobApplications,
    createApplication,
    getCandidateApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    getApplicationById,
    deleteApplication,
};
