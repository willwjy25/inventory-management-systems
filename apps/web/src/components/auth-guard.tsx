'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/providers/auth-provider';

interface AuthGuardProps {
  children: ReactNode;
  /** When true, authenticated users are redirected away (e.g. login page) */
  guestOnly?: boolean;
  redirectTo?: string;
}

/**
 * Client-side route guard. Server middleware can be added later for stricter control.
 */
export function AuthGuard({ children, guestOnly = false, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    if (guestOnly && isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    if (!guestOnly && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [guestOnly, isAuthenticated, isBootstrapping, redirectTo, router]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return null;
  }

  if (!guestOnly && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
