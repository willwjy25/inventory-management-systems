import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '@ims/types';

import { ForbiddenError, UnauthorizedError } from '../common/errors/app-error.js';
import { prisma } from '../lib/prisma.js';
import type { AuthUser } from '../types/auth.js';
import { verifyAccessToken } from '../utils/token.js';
import { asyncHandler } from './async-handler.js';

function extractBearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

/**
 * Requires a valid Bearer access token and attaches `req.user`.
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Account is inactive or does not exist');
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name as UserRole,
      isActive: user.isActive,
    };

    req.user = authUser;
    next();
  },
);

/**
 * Role gate — use after `authenticate`.
 * Example: `requireRoles('ADMIN', 'SUPER_ADMIN')`
 */
export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to perform this action'));
      return;
    }

    next();
  };
}
