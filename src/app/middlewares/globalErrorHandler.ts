/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import {
  HttpException,
  BadRequestError,
  InternalServerError,
} from '../errors/httpErrors';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Default error response structure
  const errorResponse = {
    success: false,
    message: err.message || 'Something went wrong!',
    errorDetails: err.details || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  };

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    errorResponse.message = 'Validation Error';
    errorResponse.errorDetails = formattedErrors;
    res.status(400).json(errorResponse);
    return; // Ensure no further execution
  }

  // Handle Mongoose Errors
  if (err instanceof mongoose.Error.ValidationError) {
    errorResponse.message = 'Validation Error';
    errorResponse.errorDetails = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json(errorResponse);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    errorResponse.message = `Invalid ${err.path}: ${err.value}`;
    res.status(400).json(errorResponse);
    return;
  }

  // Handle Custom HTTP Errors
  if (err instanceof HttpException) {
    res.status(err.status).json({
      ...errorResponse,
      message: err.message,
      errorDetails: err.details || null,
    });
    return;
  }

  // Handle Unexpected Errors (500)
  console.error('🚨 Unexpected Error:', err);
  const serverError = new InternalServerError();
  res.status(serverError.status).json({
    ...errorResponse,
    message: serverError.message,
  });
  return;
};

export default globalErrorHandler;
