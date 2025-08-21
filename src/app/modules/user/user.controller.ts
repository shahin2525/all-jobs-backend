import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import { StatusCodes } from 'http-status-codes';
import { createUserValidationSchema } from './user.validation';

// Create a new user
const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const validatedData = createUserValidationSchema.parse(data);
    const result = await UserServices.createUserIntoDB(validatedData);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User registered successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
const getSingleUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserServices.getSingleUserFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getAllUserFromDB();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Users retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await UserServices.deleteUserFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User deleted successfully',
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's profile
const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId; // comes from auth middleware
    const result = await UserServices.getMyProfileFromDB(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update logged-in user's profile
const updateMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId; // comes from auth middleware
    const updateData = req.body;
    const result = await UserServices.updateMyProfileInDB(userId, updateData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
