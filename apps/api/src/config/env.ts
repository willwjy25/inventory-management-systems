/**
 * Typed environment access.
 * Secrets and DB URLs will be added when auth/Prisma features land.
 * Fail fast on missing required values — never silently run misconfigured.
 */

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  WEB_ORIGIN: requireEnv('WEB_ORIGIN', 'http://localhost:3000'),
} as const;
