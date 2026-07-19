import type { ApiFieldError } from '@ims/types';

/**
 * Operational (expected) application error.
 * Distinguishes programmer bugs from controlled failures we can safely expose.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly errors: ApiFieldError[];
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errors: ApiFieldError[] = [],
    options?: { isOperational?: boolean; cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = options?.isOperational ?? true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors: ApiFieldError[] = []) {
    super(message, 400, errors);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', errors: ApiFieldError[] = []) {
    super(message, 409, errors);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors: ApiFieldError[] = []) {
    super(message, 422, errors);
    this.name = 'ValidationError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable', cause?: unknown) {
    super(message, 503, [], { cause });
    this.name = 'ServiceUnavailableError';
  }
}
