import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import { AuthValidations } from './auth.validation';
import { AuthServices } from './auth.service';

// 🔐 Login
const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;

    const validatedData = AuthValidations.loginUserValidationSchema.parse(data);
    const result = await AuthServices.loginUser(validatedData);

    const { accessToken, refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      statusCode: StatusCodes.OK,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// 🔁 Refresh Token
const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    const result = await AuthServices.refreshToken(token);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'New access token generated',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 🔑 Change Password
const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req.user as { userId: string }).userId;
    const { oldPassword, newPassword } =
      AuthValidations.changePasswordValidationSchema.parse(req.body);

    await AuthServices.changePassword(userId, oldPassword, newPassword);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully',
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ❓ Forget Password
const forgetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email } = AuthValidations.forgetPasswordValidationSchema.parse(
      req.body,
    );
    const result = await AuthServices.forgetPassword(email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// 🔄 Reset Password
const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { token, newPassword } =
      AuthValidations.resetPasswordValidationSchema.parse(req.body);

    const result = await AuthServices.resetPassword(token, newPassword);

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
