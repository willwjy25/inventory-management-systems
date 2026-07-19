import { Router } from 'express';

import { ServiceUnavailableError } from '../common/errors/app-error.js';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { sendSuccess } from '../utils/api-response.js';

export const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error: unknown) {
      // Original error kept as cause for server logs; client only sees the message.
      throw new ServiceUnavailableError('Database connection failed', error);
    }

    sendSuccess(
      res,
      {
        status: 'healthy' as const,
        uptime: process.uptime(),
        database: 'up' as const,
      },
      'OK',
    );
  }),
);
