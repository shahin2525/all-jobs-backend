"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
// application.model.ts
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    candidateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: String,
    coverLetterUrl: String,
    status: {
        type: String,
        enum: [
            'pending',
            'reviewed',
            'shortlisted',
            'interviewed',
            'accepted',
            'rejected',
        ],
        default: 'pending',
    },
    statusHistory: [
        {
            status: String,
            changedAt: { type: Date, default: Date.now },
            changedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            notes: String,
        },
    ],
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    viewedAt: Date,
    viewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    screeningAnswers: [
        {
            question: String,
            answer: String,
        },
    ],
    source: String,
}, {
    timestamps: true, // Auto-manage createdAt and updatedAt
});
// Auto-update updatedAt on save
applicationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.Application = (0, mongoose_1.model)('Application', applicationSchema);
