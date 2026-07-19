import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth/components/login-form';
import { AuthGuard } from '@/components/auth-guard';

export const metadata: Metadata = {
  title: 'Sign in · Inventory Management System',
};

export default function LoginPage() {
  return (
    <AuthGuard guestOnly>
      <main className="relative flex min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#e2e8f0_0%,_#f8fafc_40%,_#f1f5f9_100%)]" />

        <section className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-10 lg:w-[44%] lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
              Inventory Management System
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Sign in
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Access your workspace to manage products, stock, and suppliers.
            </p>

            <LoginForm />

            <p className="mt-8 text-xs leading-relaxed text-slate-500">
              Demo: <span className="text-slate-700">admin@ims.local</span> /{' '}
              <span className="text-slate-700">Password123!</span>
            </p>
          </div>
        </section>

        <aside className="relative z-10 hidden border-l border-slate-200/80 lg:flex lg:w-[56%] lg:items-end lg:px-16 lg:py-16">
          <div className="max-w-lg">
            <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">Operations</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              Clear stock visibility for modern teams.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Track inventory movements, low stock, and supplier catalogs from one secure workspace.
            </p>
          </div>
        </aside>
      </main>
    </AuthGuard>
  );
}
