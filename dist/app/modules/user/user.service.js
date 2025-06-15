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
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
// Create a new user
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existsUser = yield user_model_1.User.findOne({ email: payload.email });
    if (existsUser) {
        throw new Error('User already exists');
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
// Get a single user by ID
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   if (!(await User.doesUserExists(id))) {
    //     throw new Error('User ID does not exist');
    //   }
    const idExists = yield user_model_1.User.findById({ _id: id });
    if (idExists) {
        throw new Error('User ID does not exist');
    }
    const result = yield user_model_1.User.findById(id).select('-password');
    return result;
});
// Get all users
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find().select('-password');
    return result;
});
// Delete a user by ID
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   if (!(await User.doesUserExists(id))) {
    //     throw new Error('User ID does not exist');
    //   }
    const idExists = yield user_model_1.User.findById({ _id: id });
    if (idExists) {
        throw new Error('User ID does not exist');
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    return result;
});
// Get my own profile
const getMyProfileFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
// Update my own profile
const updateMyProfileInDB = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
        new: true,
    }).select('-password');
    if (!user) {
        throw new Error('Failed to update profile');
    }
    return user;
});
exports.UserServices = {
    createUserIntoDB,
    getSingleUserFromDB,
    getAllUserFromDB,
    deleteUserFromDB,
    getMyProfileFromDB,
    updateMyProfileInDB,
};
