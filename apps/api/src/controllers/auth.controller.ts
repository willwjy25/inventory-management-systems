import type { Request, Response } from 'express';

import { authService } from '../services/auth.service.js';
import type { LoginBody } from '../validators/auth.validator.js';
import {
  clearRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
  setRefreshTokenCookie,
} from '../utils/cookies.js';
import { sendSuccess } from '../utils/api-response.js';

function requestMeta(req: Request) {
  return {
    userAgent: req.get('user-agent') ?? undefined,
    ipAddress: req.ip,
  };
}

export const authController = {
  async login(req: Request, res: Response) {
    const body = req.body as LoginBody;
    const result = await authService.login(body, requestMeta(req));

    setRefreshTokenCookie(res, result.refreshToken, result.refreshExpiresAt);

    return sendSuccess(
      res,
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      'Login successful',
    );
  },

  async refresh(req: Request, res: Response) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    const result = await authService.refresh(rawToken, requestMeta(req));

    setRefreshTokenCookie(res, result.refreshToken, result.refreshExpiresAt);

    return sendSuccess(
      res,
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      'Token refreshed',
    );
  },

  async logout(req: Request, res: Response) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    await authService.logout(rawToken);
    clearRefreshTokenCookie(res);

    return sendSuccess(res, null, 'Logged out successfully');
  },

  async me(req: Request, res: Response) {
    return sendSuccess(res, { user: req.user }, 'Current user');
  },
};
