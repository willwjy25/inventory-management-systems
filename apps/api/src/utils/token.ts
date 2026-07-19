import { createHash, randomBytes } from 'node:crypto';

import jwt from 'jsonwebtoken';

import type { UserRole } from '@ims/types';

import { UnauthorizedError } from '../common/errors/app-error.js';
import { env } from '../config/env.js';
import type { AccessTokenPayload, AuthTokens } from '../types/auth.js';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateRefreshTokenValue(): string {
  return randomBytes(48).toString('hex');
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (typeof decoded !== 'object' || decoded === null) {
      throw new UnauthorizedError('Invalid access token');
    }

    const { sub, email, role } = decoded as Partial<AccessTokenPayload>;

    if (!sub || !email || !role) {
      throw new UnauthorizedError('Invalid access token payload');
    }

    return { sub, email, role: role as UserRole };
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function getRefreshExpiryDate(): Date {
  return new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRES_IN));
}

export function buildAuthTokens(payload: AccessTokenPayload): AuthTokens {
  const refreshToken = generateRefreshTokenValue();

  return {
    accessToken: signAccessToken(payload),
    refreshToken,
    refreshExpiresAt: getRefreshExpiryDate(),
  };
}

/**
 * Parses simple duration strings used by JWT (e.g. 15m, 7d, 1h).
 * Avoids pulling an extra runtime dependency for one conversion.
 */
function parseDurationMs(value: string): number {
  const match = /^(\d+)([smhd])$/i.exec(value.trim());

  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase();

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  const multiplier = unit ? multipliers[unit] : undefined;

  if (!multiplier) {
    throw new Error(`Invalid duration unit: ${value}`);
  }

  return amount * multiplier;
}
