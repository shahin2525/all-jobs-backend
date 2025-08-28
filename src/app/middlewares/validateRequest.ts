import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('data2', req.body);
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};
//

// export default validateRequest;
// middleware/validateRequest.ts
//
// import { NextFunction, Request, Response } from 'express';
// import { AnyZodObject, ZodError } from 'zod';

// const validateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errors = error.errors.map((err) => ({
//           path: err.path.join('.'),
//           message: err.message,
//         }));

//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors,
//         });
//       }
//       next(error);
//     }
//   };
// };

// export default validateRequest;

// import { NextFunction, Request, Response } from 'express';
// import { AnyZodObject, ZodError } from 'zod';

// const validateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Parse and validate the request
//       const result = await schema.parseAsync({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });

//       // Replace the request body with the validated data
//       if (result.body) {
//         req.body = result.body;
//       }

//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         // Format Zod validation errors for better client response
//         const formattedErrors = error.errors.map((err) => ({
//           field: err.path.join('.'),
//           message: err.message,
//           code: err.code,
//         }));

//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors: formattedErrors,
//         });
//       }

//       // Pass other errors to the global error handler
//       next(error);
//     }
//   };
// };

export default validateRequest;
