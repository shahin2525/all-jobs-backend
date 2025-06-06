import { TUser } from './user.interface';
import { User } from './user.model';

// Create a new user
const createUserIntoDB = async (payload: TUser) => {
  const existsUser = await User.findOne({ email: payload.email });
  if (existsUser) {
    throw new Error('User already exists');
  }
  const result = await User.create(payload);
  return result;
};

// Get a single user by ID
const getSingleUserFromDB = async (id: string) => {
  //   if (!(await User.doesUserExists(id))) {
  //     throw new Error('User ID does not exist');
  //   }
  const idExists = await User.findById({ _id: id });
  if (idExists) {
    throw new Error('User ID does not exist');
  }
  const result = await User.findById(id).select('-password');
  return result;
};

// Get all users
const getAllUserFromDB = async () => {
  const result = await User.find().select('-password');
  return result;
};

// Delete a user by ID
const deleteUserFromDB = async (id: string) => {
  //   if (!(await User.doesUserExists(id))) {
  //     throw new Error('User ID does not exist');
  //   }
  const idExists = await User.findById({ _id: id });
  if (idExists) {
    throw new Error('User ID does not exist');
  }
  const result = await User.findByIdAndDelete(id);
  return result;
};

// Get my own profile
const getMyProfileFromDB = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Update my own profile
const updateMyProfileInDB = async (
  userId: string,
  updateData: Partial<TUser>,
) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select('-password');
  if (!user) {
    throw new Error('Failed to update profile');
  }
  return user;
};

export const UserServices = {
  createUserIntoDB,
  getSingleUserFromDB,
  getAllUserFromDB,
  deleteUserFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
