// import { Response } from 'express';

// type IApiResponse<T> = {
//   statusCode: number;
//   success: boolean;
//   message?: string;
//   data: T;
//   meta?: {
//     page: number;
//     limit: number;
//     total: number;
//   };
// };

// const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
//   const responseData: IApiResponse<T> = {
//     statusCode: data.statusCode,
//     success: data.success,
//     message: data.message,
//     data: data.data,
//     ...(data.meta && { meta: data.meta }),
//   };

//   res.status(data.statusCode).json(responseData);
// };

// export default sendResponse;
import { Response } from 'express';
import StatusCodes from 'http-status-codes';

const sendResponse = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number = StatusCodes.OK,
  success: boolean = true,
) => {
  res.status(statusCode).json({
    success,
    message,
    statusCode,
    data,
  });
};

export default sendResponse;
