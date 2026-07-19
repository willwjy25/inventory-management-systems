const ACCESS_TOKEN_KEY = 'ims_access_token';

/**
 * Access tokens live in sessionStorage (tab-scoped) — not localStorage —
 * to reduce XSS persistence risk. Refresh tokens stay in HttpOnly cookies (API).
 */
export const accessTokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  set(token: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
