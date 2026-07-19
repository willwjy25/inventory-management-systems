import type { Response } from 'express';

import type { ApiErrorResponse, ApiFieldError, ApiSuccessResponse } from '@ims/types';

/**
 * Standardized success envelope — single place to change response shape later.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(body);
}

/**
 * Standardized error envelope — used by the global error handler (and rarely by controllers).
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors: ApiFieldError[] = [],
): Response {
  const body: ApiErrorResponse = {
    success: false,
    message,
    errors,
  };

  return res.status(statusCode).json(body);
}
