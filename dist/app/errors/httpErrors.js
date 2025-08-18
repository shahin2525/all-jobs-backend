"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.HttpException = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
class HttpException extends Error {
    constructor(
    // eslint-disable-next-line no-unused-vars
    status, message, details) {
        super(message);
        this.status = status;
        this.message = message;
        this.details = details;
    }
}
exports.HttpException = HttpException;
class BadRequestError extends HttpException {
    constructor(message = 'Bad Request', details) {
        super(400, message, details);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends HttpException {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends HttpException {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends HttpException {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends HttpException {
    constructor(message = 'Internal Server Error') {
        super(500, message);
    }
}
exports.InternalServerError = InternalServerError;
