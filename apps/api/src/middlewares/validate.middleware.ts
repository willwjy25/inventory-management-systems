import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

/**
 * Validates req.body against a Zod schema.
 * On failure, forwards the ZodError to the global error handler.
 */
export function validateBody<TSchema extends ZodType>(schema: TSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    req.body = result.data;
    next();
  };
}
