import bcrypt from 'bcrypt';

import type { AuthUser } from '../types/auth.js';
import { UnauthorizedError } from '../common/errors/app-error.js';
import { refreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { toAuthRole, userRepository } from '../repositories/user.repository.js';
import type { LoginBody } from '../validators/auth.validator.js';
import { buildAuthTokens, hashToken } from '../utils/token.js';

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: { name: string };
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: toAuthRole(user.role.name),
    isActive: user.isActive,
  };
}

export const authService = {
  async login(
    input: LoginBody,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithRole(input.email.toLowerCase());

    // Same message for missing user and bad password — avoid account enumeration
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const publicUser = toPublicUser(user);
    const tokens = buildAuthTokens({
      sub: publicUser.id,
      email: publicUser.email,
      role: publicUser.role,
    });

    await refreshTokenRepository.create({
      tokenHash: hashToken(tokens.refreshToken),
      userId: user.id,
      expiresAt: tokens.refreshExpiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return {
      user: publicUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      refreshExpiresAt: tokens.refreshExpiresAt,
    };
  },

  async refresh(
    rawRefreshToken: string | undefined,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<AuthResult> {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const existing = await refreshTokenRepository.findValidByHash(hashToken(rawRefreshToken));

    if (!existing || !existing.user.isActive) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate: revoke old token, issue a new pair
    await refreshTokenRepository.revokeByHash(existing.tokenHash);

    const publicUser = toPublicUser(existing.user);
    const tokens = buildAuthTokens({
      sub: publicUser.id,
      email: publicUser.email,
      role: publicUser.role,
    });

    await refreshTokenRepository.create({
      tokenHash: hashToken(tokens.refreshToken),
      userId: publicUser.id,
      expiresAt: tokens.refreshExpiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return {
      user: publicUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      refreshExpiresAt: tokens.refreshExpiresAt,
    };
  },

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    await refreshTokenRepository.revokeByHash(hashToken(rawRefreshToken));
  },
};
