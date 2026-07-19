import { PrismaClient } from '../generated/prisma/index.js';

/**
 * PrismaClient singleton.
 * In development, reuse the same instance across hot reloads to avoid
 * exhausting database connections.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
