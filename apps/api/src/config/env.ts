/**
 * Typed environment access.
 * Fail fast on missing required values — never silently run misconfigured.
 */

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function requireSecret(key: string, fallback?: string): string {
  const value = requireEnv(key, fallback);

  if (value.length < 32) {
    throw new Error(`${key} must be at least 32 characters`);
  }

  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  WEB_ORIGIN: requireEnv('WEB_ORIGIN', 'http://localhost:3000'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_ACCESS_SECRET: requireSecret('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: requireSecret('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: requireEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: requireEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
} as const;
