import { Button } from '@ims/ui';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e2e8f0_0%,_#f8fafc_45%,_#f1f5f9_100%)]" />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
          Portfolio
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Inventory Management System
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Monorepo foundation is ready. Auth, catalog, and inventory features land next — step by
          step.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Continue building</Button>
          <Button variant="secondary">View architecture</Button>
        </div>
      </div>
    </main>
  );
}
