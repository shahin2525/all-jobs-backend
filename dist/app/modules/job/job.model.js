"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: String,
    location: String,
    source: { type: String, enum: ['own', 'third-party'], default: 'own' },
    isCompliant: { type: Boolean, default: true },
    applyLink: String,
    postedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Job = (0, mongoose_1.model)('Job', JobSchema);
