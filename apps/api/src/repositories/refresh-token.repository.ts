import { prisma } from '../lib/prisma.js';

export const refreshTokenRepository = {
  create(input: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }) {
    return prisma.refreshToken.create({
      data: {
        tokenHash: input.tokenHash,
        userId: input.userId,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
      },
    });
  },

  findValidByHash(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });
  },

  revokeByHash(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
};
