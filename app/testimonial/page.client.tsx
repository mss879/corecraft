'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function TestimonialSubmitPageClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => String(searchParams.get('token') ?? ''), [searchParams]);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    if (!token) {
      setError('This testimonial link is missing a token. Please ask for a new link.');
      return;
    }

    const cleanedQuote = quote.trim();
    if (!cleanedQuote) {
      setError('Please write your testimonial.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        request_token: token,
        quote: cleanedQuote,
        name: name.trim() || null,
        role: role.trim() || null,
        rating,
        variant: 'accent',
        published: true,
      };

      const { error: insertError } = await supabase.from('testimonials').insert(payload);
      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[720px] px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_100px_-80px_rgba(0,0,0,0.9)]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">CoreCraft</p>
            <h1 className="text-3xl font-semibold" style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}>
              Share your testimonial
            </h1>
            <p className="text-sm text-white/60">Write a short review. It will appear on the CoreCraft website.</p>
          </div>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 text-white/80">
              Thanks — your testimonial has been submitted.
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              <div className="grid gap-2">
                <label className="text-xs text-white/60">Name (optional)</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10 bg-black/40 text-white"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Role / Company (optional)</label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border-white/10 bg-black/40 text-white"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Testimonial</label>
                <Textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="min-h-[160px] border-white/10 bg-black/40 text-white"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Rating (1–5)</label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border-white/10 bg-black/40 text-white"
                />
              </div>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <Button
                onClick={submit}
                disabled={submitting}
                className="mt-2 h-12 rounded-2xl bg-[#ff502e] px-6 text-base font-semibold text-black hover:bg-[#ff6b49]"
              >
                {submitting ? 'Submitting…' : 'Submit testimonial'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
