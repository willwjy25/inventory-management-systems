import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { sendSuccess } from './utils/api-response.js';

/**
 * Application factory — keeps bootstrap (index.ts) separate from
 * middleware composition so tests can create an app without listening.
 *
 * Middleware order matters:
 *   security → parsers → routes → 404 → error handler
 */
export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use('/health', healthRouter);
  app.use('/auth', authRouter);

  app.get('/', (_req, res) => {
    sendSuccess(
      res,
      {
        name: 'ims-api',
        version: '0.0.0',
      },
      'Inventory Management System API',
    );
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
