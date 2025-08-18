import bcrypt from 'bcrypt';

import { sendResetPasswordEmail } from './auth.utils';
// import { ILoginInput, ITokenPayload } from '../interfaces/auth.interface';
import { createToken, verifyToken } from './auth.utils2';
import config from '../../config';
import { ILoginInput } from './auth.interface';
import { User } from '../user/user.model';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';

// 🔐 Login
const loginUser = async (payload: ILoginInput) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  // console.log('service', email, password);
  console.log('user', user);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new AppError(StatusCodes.BAD_REQUEST, 'password does not match');
  const jwtPayload = {
    userId: user?._id,
    name: user?.name,
    email: user?.email as string,

    isActive: user?.isActive,
    role: user?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.jwt_access_expire_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret as string,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
    // user: {
    //   _id: user._id,
    //   email: user.email,
    //   role: user.role,
    // },
  };
};

// 🔁 Refresh Token
const refreshToken = async (token: string) => {
  try {
    const decoded = verifyToken(token, config.refresh_secret as string);

    const { userId } = decoded;

    // checking if the user is exist
    const user = await User.findOne(userId);
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

    // checking if the user is blocked
    const userActive = user?.isActive;

    if (!userActive) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is in blocked ! !');
    }

    const jwtPayload = {
      userId: user?._id,
      name: user?.name,
      email: user?.email as string,

      isActive: user?.isActive,
      role: user?.role,
    };
    const accessToken = createToken(
      jwtPayload,
      config.access_secret as string,
      config.jwt_access_expire_in as string,
    );

    return { accessToken };
  } catch {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid refresh token');
  }
};

// 🔑 Change Password
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    throw new AppError(StatusCodes.BAD_REQUEST, 'Old password is incorrect');

  const hashed = await bcrypt.hash(newPassword, Number(config.salt));
  // user.password = hashed;
  // await user.save();
  await User.findOneAndUpdate(
    {
      id: user._id,
      role: user.role,
    },
    {
      password: hashed,

      passwordChangedAt: new Date(),
    },
  );

  return null;
};

// ❓ Forget Password
const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new AppError(StatusCodes.NOT_FOUND, 'No user found with this email');

  const jwtPayload = {
    userId: user?._id,
    name: user?.name,
    email: user?.email as string,

    isActive: user?.isActive,
    role: user?.role,
  };
  const resetToken = createToken(
    jwtPayload,
    config.access_secret as string,
    config.jwt_access_expire_in as string,
  );

  const resetUrl = `${config.resend}/reset-password?token=${resetToken}`;

  await sendResetPasswordEmail(email, resetUrl);

  return { message: 'Reset password email sent' };
};

// 🔄 Reset Password
const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = verifyToken(token, config.refresh_secret as string);

    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return { message: 'Password reset successfully' };
  } catch {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid or expired token');
  }
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
