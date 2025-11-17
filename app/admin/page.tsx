"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const highlights = [
  {
    title: 'Live inquiry feed',
    description: 'Capture every website conversation in one secure inbox.',
  },
  {
    title: 'Pipeline clarity',
    description: 'Progress deals from New to Won with drag-and-drop precision.',
  },
  {
    title: 'Role-based access',
    description: 'Only trusted operators can reach these controls.',
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020305] text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 20%, rgba(255,80,46,0.35), transparent 55%), radial-gradient(circle at 85% 0%, rgba(103,116,255,0.25), transparent 50%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.08), transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent)] mix-blend-screen" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-[#ff502e]" /> Ops Portal
            </div>
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">CoreCraft Command</p>
              <h1 className="text-4xl font-light leading-tight text-white sm:text-5xl">
                Secure entry to your <span className="font-semibold text-[#ff8468]">control tower</span>
              </h1>
              <p className="max-w-xl text-base text-white/70">
                Monitor website inquiries, manage the CRM flow, and keep every touchpoint polished.
                Authentication keeps this private workspace for approved operators only.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff502e]/20 text-[#ff502e]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-white/70">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[28px] border border-white/10 bg-[#040405]/80 p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.25em] text-white/50">Authenticate</p>
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="text-sm text-white/60">Use your CoreCraft admin credentials to continue.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-2xl border-white/10 bg-white/5 text-base text-white placeholder:text-white/50 focus-visible:ring-[#ff502e]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-2xl border-white/10 bg-white/5 text-base text-white placeholder:text-white/50 focus-visible:ring-[#ff502e]"
              />
            </div>
            {error && (
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200" aria-live="polite">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="h-14 w-full rounded-2xl bg-[#ff502e] text-base font-semibold text-black transition hover:bg-[#ff6b49]"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Enter workspace'}
            </Button>
            <p className="text-center text-xs text-white/50">
              Having trouble? <a href="mailto:hello@corecraft.com" className="text-white">Contact support.</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
