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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Never returned by default
    role: {
        type: String,
        enum: ['admin', 'recruiter', 'candidate'],
        default: 'candidate',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: { type: Boolean, default: false },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    profile: {
        skills: [{ type: String }],
        company: String,
        avatar: String,
    },
}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this function if password was actually modified
        if (!this.isModified('password'))
            return next();
        try {
            // Hash the password with cost of 12
            this.password = yield bcrypt_1.default.hash(this.password, 12);
            // Set passwordChangedAt if it's not a new user
            if (!this.isNew) {
                this.passwordChangedAt = new Date(Date.now() - 1000); // Subtract 1 second to ensure token was created after password change
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
// Method to compare entered password with hashed password in database
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
// Method to check if password was changed after a given timestamp (for JWT)
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
