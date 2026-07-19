import type { CookieOptions, Response } from 'express';

import { env } from '../config/env.js';

export const REFRESH_COOKIE_NAME = 'ims_refresh_token';

function refreshCookieOptions(expires: Date): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/auth',
    expires,
  };
}

export function setRefreshTokenCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions(expiresAt));
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/auth',
  });
}
