"use strict";
// import { model, Schema } from 'mongoose';
// import { IJob } from './job.interface';
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
exports.Job = void 0;
// const JobSchema = new Schema<IJob>(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     company: String,
//     location: String,
//     source: { type: String, enum: ['own', 'third-party'], default: 'own' },
//     isCompliant: { type: Boolean, default: true },
//     applyLink: String,
//     postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
//   },
//   { timestamps: true },
// );
// export const Job = model<IJob>('Job', JobSchema);
const mongoose_1 = require("mongoose");
// Define the schema
const JobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'USD' }, // Default to USD
    },
    employmentType: {
        type: String,
        required: true,
        enum: [
            'full-time',
            'part-time',
            'contract',
            'remote',
            'internship',
            'freelance',
        ],
    },
    source: {
        type: String,
        required: true,
        enum: ['own', 'third-party'],
    },
    applyLink: { type: String }, // Required if source=third-party
    postedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead'],
    },
    educationRequired: [{ type: String }], // Array of strings
    skillsRequired: [{ type: String }], // Array of skills
    applicants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }], // User IDs who applied
    savedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }], // User IDs who bookmarked
    postedAt: { type: Date, default: Date.now }, // Auto-set on creation
    expiresAt: { type: Date }, // Manual/auto expiry date
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});
//
// Add to your JobSchema methods
JobSchema.statics.doesJobExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const job = yield this.findById(id);
        return job;
    });
};
// Create and export the model
exports.Job = (0, mongoose_1.model)('Job', JobSchema);
