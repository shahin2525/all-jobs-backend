"use strict";
// import { Request, RequestHandler, Response } from 'express';
// import { UserServices } from './user.service';
// import { StatusCodes } from 'http-status-codes';
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
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const http_status_codes_1 = require("http-status-codes");
// Create a new user
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield user_service_1.UserServices.createUserIntoDB(data);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'User registered successfully',
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Get a single user by ID
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield user_service_1.UserServices.getSingleUserFromDB(id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'User retrieved successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Get all users
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserServices.getAllUserFromDB();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Users retrieved successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete a user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield user_service_1.UserServices.deleteUserFromDB(id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'User deleted successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Get logged-in user's profile
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id; // comes from auth middleware
        const result = yield user_service_1.UserServices.getMyProfileFromDB(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Profile retrieved successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
// Update logged-in user's profile
const updateMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id; // comes from auth middleware
        const updateData = req.body;
        const result = yield user_service_1.UserServices.updateMyProfileInDB(userId, updateData);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Profile updated successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UserController = {
    createUser,
    getSingleUser,
    getAllUsers,
    deleteUser,
    getMyProfile,
    updateMyProfile,
};
