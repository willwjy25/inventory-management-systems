'use client';

import { Button } from '@ims/ui';

import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Inventory Management System
              </p>
              <h1 className="mt-1 text-lg font-semibold text-slate-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">
                  {user?.email} · {user?.role}
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => void handleLogout()}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm text-slate-600">
            You are signed in. Product, inventory, and report modules will land in upcoming
            features.
          </p>
        </section>
      </main>
    </AuthGuard>
  );
}
