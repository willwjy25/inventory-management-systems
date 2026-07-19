import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import type { ApiSuccessResponse } from '@ims/types';

import { env } from './config/env.js';
import { healthRouter } from './routes/health.routes.js';

/**
 * Application factory — keeps bootstrap (index.ts) separate from
 * middleware composition so tests can create an app without listening.
 */
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.use('/health', healthRouter);

  app.get('/', (_req, res) => {
    const body: ApiSuccessResponse<{ name: string; version: string }> = {
      success: true,
      message: 'Inventory Management System API',
      data: {
        name: 'ims-api',
        version: '0.0.0',
      },
    };

    res.status(200).json(body);
  });

  return app;
}
