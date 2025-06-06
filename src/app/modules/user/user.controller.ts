import { Request, RequestHandler, Response } from 'express';
import { UserServices } from './user.service';

// Create a new user
// const createUser = async (req: Request, res: Response) => {
//   try {
//     const result = await UserServices.createUserIntoDB(req.body);
//     res.status(201).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };
const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await UserServices.createUserIntoDB(data);
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
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await UserServices.getSingleUserFromDB(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get all users
const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUserFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await UserServices.deleteUserFromDB(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get logged-in user's profile
const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id; // comes from auth middleware
    const result = await UserServices.getMyProfileFromDB(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update logged-in user's profile
const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id; // comes from auth middleware
    const updateData = req.body;
    const result = await UserServices.updateMyProfileInDB(userId, updateData);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
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
