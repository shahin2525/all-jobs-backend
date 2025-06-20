/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export class HttpException extends Error {
  constructor(
    // eslint-disable-next-line no-unused-vars
    public status: number,
    public message: string,
    public details?: any,
  ) {
    super(message);
  }
}

export class BadRequestError extends HttpException {
  constructor(message: string = 'Bad Request', details?: any) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class ConflictError extends HttpException {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class InternalServerError extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}
