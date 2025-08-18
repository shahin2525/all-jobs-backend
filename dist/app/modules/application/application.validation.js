"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationValidation = void 0;
const zod_1 = require("zod");
const createApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().min(1, 'Job ID is required'),
        resumeUrl: zod_1.z
            .string()
            .url('Invalid resume URL')
            .min(1, 'Resume is required'),
        coverLetter: zod_1.z.string().optional(),
    }),
});
const updateApplicationStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            'pending',
            'reviewed',
            'shortlisted',
            'interviewed',
            'accepted',
            'rejected',
        ]),
        notes: zod_1.z.string().optional(),
    }),
});
exports.ApplicationValidation = {
    createApplicationSchema,
    updateApplicationStatusSchema,
};
