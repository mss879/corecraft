import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,80,46,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(109,99,255,0.25), transparent 45%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.08), transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent)] mix-blend-screen" aria-hidden="true" />
      <div className="relative z-10 min-h-screen backdrop-blur-[2px]">
        <header className="border-b border-white/10 bg-black/60 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">CoreCraft</p>
              <h1 className="text-xl font-semibold">Admin Control Room</h1>
            </div>
            <p className="hidden text-sm text-white/60 md:block">Secure tools for website ops & growth</p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
