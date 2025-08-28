import { AuthServices } from '../auth/auth.service';
import { TUser, TUserUpdateRequest } from './user.interface';
import { User } from './user.model';

// Create a new user
const createUserIntoDB = async (payload: TUser) => {
  const existsUser = await User.findOne({ email: payload.email });
  if (existsUser) {
    throw new Error('User already exists');
  }
  await User.create(payload);
  return await AuthServices.loginUser({
    email: payload?.email,
    password: payload?.password,
  });
};

// Get a single user by ID
const getSingleUserFromDB = async (id: string) => {
  //   if (!(await User.doesUserExists(id))) {
  //     throw new Error('User ID does not exist');
  //   }
  const idExists = await User.findById(id);
  if (!idExists) {
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
  const idExists = await User.findById(id);
  if (!idExists) {
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
// const updateMyProfileInDB = async (
//   userId: string,
//   updateData: Partial<TUser>,
// ) => {
//   const user = await User.findByIdAndUpdate(userId, updateData, {
//     new: true,
//   }).select('-password');
//   if (!user) {
//     throw new Error('Failed to update profile');
//   }
//   return user;
// };

const updateMyProfileInDB = async (
  userId: string,
  updateData: TUserUpdateRequest, // Use any to accept flat properties
) => {
  const currentUser = await User.findById(userId);
  const currentUserRole = currentUser?.role;

  const updateObject: Record<string, unknown> = {};

  // Handle flat firstName and lastName properties
  if (updateData.firstName) {
    updateObject['name.firstName'] = updateData.firstName;
  }
  if (updateData.lastName) {
    updateObject['name.lastName'] = updateData.lastName;
  }

  // Handle nested name object (for backward compatibility)
  if (updateData.name) {
    if (updateData.name.firstName) {
      updateObject['name.firstName'] = updateData.name.firstName;
    }
    if (updateData.name.lastName) {
      updateObject['name.lastName'] = updateData.name.lastName;
    }
  }

  // Handle flat profile properties
  if (updateData.skills) {
    updateObject['profile.skills'] = updateData.skills;
  }
  if (updateData.company) {
    updateObject['profile.company'] = updateData.company;
  }
  if (updateData.avatar) {
    updateObject['profile.avatar'] = updateData.avatar;
  }

  // Handle nested profile object (for backward compatibility)
  if (updateData.profile) {
    if (updateData.profile.skills) {
      updateObject['profile.skills'] = updateData.profile.skills;
    }
    if (updateData.profile.company) {
      updateObject['profile.company'] = updateData.profile.company;
    }
    if (updateData.profile.avatar) {
      updateObject['profile.avatar'] = updateData.profile.avatar;
    }
  }

  // Handle other direct properties
  const directProperties: (keyof TUser)[] = [
    'email',
    'phone',
    'isActive',
    'isVerified',
  ];

  directProperties.forEach((prop) => {
    if (updateData[prop] !== undefined) {
      updateObject[prop] = updateData[prop];
    }
  });

  // Only allow admin to update role
  if (updateData.role) {
    if (currentUserRole === 'admin') {
      updateObject.role = updateData.role;
    } else {
      throw new Error('Only admin can update user role');
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateObject, {
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
