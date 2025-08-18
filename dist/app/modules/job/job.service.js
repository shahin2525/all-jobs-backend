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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobServices = void 0;
const job_model_1 = require("./job.model");
const createJobIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const jobData = Object.assign(Object.assign({}, payload), { postedBy: user._id });
    const result = yield job_model_1.Job.create(jobData);
    return result;
});
const getAllJobsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.find().populate('postedBy');
    return result;
});
const updateJobFromDB = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.Job.doesJobExist(id);
    if (!job) {
        throw new Error('Job not found');
    }
    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== user._id) {
        throw new Error('Unauthorized to update this job');
    }
    const result = yield job_model_1.Job.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteJobFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.Job.doesJobExist(id);
    if (!job) {
        throw new Error('Job not found');
    }
    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== user._id) {
        throw new Error('Unauthorized to delete this job');
    }
    const result = yield job_model_1.Job.findByIdAndDelete(id);
    return result;
});
const getSingleJobFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.Job.doesJobExist(id);
    if (!job) {
        throw new Error('Job not found');
    }
    const result = yield job_model_1.Job.findById(id).populate('postedBy');
    return result;
});
const getJobsByUserFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.find({ postedBy: user._id });
    return result;
});
exports.JobServices = {
    createJobIntoDB,
    getAllJobsFromDB,
    updateJobFromDB,
    deleteJobFromDB,
    getSingleJobFromDB,
    getJobsByUserFromDB,
};
