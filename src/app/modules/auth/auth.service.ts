import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { sendResetPasswordEmail } from './auth.utils';
// import { ILoginInput, ITokenPayload } from '../interfaces/auth.interface';
import { createToken, verifyToken } from './auth.utils2';
import config from '../../config';
import { ILoginInput } from './auth.interface';
import { User } from '../user/user.model';
import AppError from '../../error/appError';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';
const RESET_TOKEN_EXPIRES_IN = '15m';

// 🔐 Login
export const loginUser = async (payload: ILoginInput) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

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
  const token = createToken(
    jwtPayload,
    config.access_secret as string,
    config.jwt_access_expire_in as string,
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return {
    token,
    refreshToken,
    // user: {
    //   _id: user._id,
    //   email: user.email,
    //   role: user.role,
    // },
  };
};

// 🔁 Refresh Token
export const refreshToken = async (token: string) => {
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
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    throw new AppError(StatusCodes.BAD_REQUEST, 'Old password is incorrect');

  const hashed = await bcrypt.hash(newPassword, Number(config.salt as number));
  user.password = hashed;
  await user.save();

  return { message: 'Password changed successfully' };
};

// ❓ Forget Password
export const forgetPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AuthError('No user found with this email');

  const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRES_IN,
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendResetPasswordEmail(email, resetUrl);

  return { message: 'Reset password email sent' };
};

// 🔄 Reset Password
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await UserModel.findById(decoded.id);
    if (!user) throw new AuthError('User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return { message: 'Password reset successfully' };
  } catch {
    throw new AuthError('Invalid or expired token');
  }
};
