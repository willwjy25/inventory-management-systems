import { Router } from 'express';

import type { ApiSuccessResponse } from '@ims/types';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const body: ApiSuccessResponse<{ status: string; uptime: number }> = {
    success: true,
    message: 'OK',
    data: {
      status: 'healthy',
      uptime: process.uptime(),
    },
  };

  res.status(200).json(body);
});
