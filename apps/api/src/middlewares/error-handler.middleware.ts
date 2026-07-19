import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '../generated/prisma/index.js';

import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../common/errors/app-error.js';
import { env } from '../config/env.js';
import { sendError } from '../utils/api-response.js';

interface ZodLikeIssue {
  path: Array<string | number>;
  message: string;
}

interface ZodLikeError {
  name: 'ZodError';
  issues: ZodLikeIssue[];
}

function isZodError(error: unknown): error is ZodLikeError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as { name?: unknown; issues?: unknown };
  return candidate.name === 'ZodError' && Array.isArray(candidate.issues);
}

function mapPrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002': {
      const fields = Array.isArray(error.meta?.target) ? (error.meta.target as string[]) : [];
      return new ConflictError('A record with this value already exists', [
        {
          field: fields[0],
          message: 'Must be unique',
        },
      ]);
    }
    case 'P2025':
      return new NotFoundError('Record not found');
    default:
      return new AppError('Database request failed', 500, [], { cause: error });
  }
}

/**
 * Global error middleware — last in the Express chain.
 * Never leak stack traces or internal details to clients in production.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (isZodError(err)) {
    const validationError = new ValidationError(
      'Validation failed',
      err.issues.map((issue) => ({
        field: issue.path.join('.') || undefined,
        message: issue.message,
      })),
    );
    sendError(res, validationError.message, validationError.statusCode, validationError.errors);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = mapPrismaError(err);
    sendError(res, mapped.message, mapped.statusCode, mapped.errors);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON payload', 400);
    return;
  }

  console.error('[api] Unhandled error:', err);

  const message =
    env.NODE_ENV === 'production'
      ? 'Internal server error'
      : getErrorMessage(err) || 'Internal server error';

  sendError(res, message, 500);
}

function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return undefined;
}
