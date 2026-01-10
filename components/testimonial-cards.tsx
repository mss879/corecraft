'use client';

import { useMemo, useRef } from 'react';
import { ArrowRight, Quote, Star } from 'lucide-react';

const accent = '#ff502e';

export type TestimonialVariant = 'accent' | 'dark';

export interface TestimonialCardData {
  id: string;
  quote: string;
  name?: string | null;
  role?: string | null;
  variant: TestimonialVariant;
}

const StarRating = ({ variant }: { variant: TestimonialVariant }) => (
  <div className="flex items-center gap-1">
    <span className="sr-only">Rated 5 out of 5</span>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        aria-hidden="true"
        className={variant === 'accent' ? 'h-4 w-4 fill-white text-white' : 'h-4 w-4 fill-[#ff502e] text-[#ff502e]'}
      />
    ))}
  </div>
);

export function TestimonialCard({
  quote,
  variant,
  name,
  role,
}: {
  quote: string;
  variant: TestimonialVariant;
  name?: string | null;
  role?: string | null;
}) {
  const isAccent = variant === 'accent';
  return (
    <article
      className={
        `flex h-full flex-col rounded-3xl border ${
          isAccent ? 'border-transparent bg-[rgb(249,69,45)] text-black' : 'border-white/10 bg-[#121212] text-white'
        } px-8 py-10 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-1 sm:px-10 sm:py-12`
      }
    >
      <div className="space-y-6">
        {!isAccent && <Quote className="h-10 w-10 text-white/10" aria-hidden="true" />}
        <StarRating variant={variant} />
        {(name || role) && (
          <div className={isAccent ? 'text-sm text-black/70' : 'text-sm text-white/70'}>
            {name && <span className={isAccent ? 'font-semibold text-black/80' : 'font-semibold text-white/80'}>{name}</span>}
            {name && role && <span className={isAccent ? 'text-black/40' : 'text-white/40'}> · </span>}
            {role && <span>{role}</span>}
          </div>
        )}
        <p className={isAccent ? 'text-base leading-relaxed text-black/80 md:text-lg' : 'text-base leading-relaxed text-white/80 md:text-lg'}>
          {quote}
        </p>
      </div>
    </article>
  );
}

export function TestimonialCards({ testimonials }: { testimonials: TestimonialCardData[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(() => {
    return testimonials.map((t) => ({
      ...t,
      variant: (t.variant === 'dark' ? 'dark' : 'accent') as TestimonialVariant,
    }));
  }, [testimonials]);

  const isScrollable = normalized.length > 3;

  if (!isScrollable) {
    return (
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {normalized.map((card) => (
          <TestimonialCard key={card.id} quote={card.quote} variant={card.variant} name={card.name} role={card.role} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative mt-16">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {normalized.map((card) => (
          <div key={card.id} className="min-w-[320px] max-w-[420px] flex-1">
            <TestimonialCard quote={card.quote} variant={card.variant} name={card.name} role={card.role} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll testimonials"
        onClick={() => containerRef.current?.scrollBy({ left: 420, behavior: 'smooth' })}
        className="absolute right-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 lg:flex"
        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <span
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-24 bg-gradient-to-l from-black to-transparent lg:block"
        aria-hidden="true"
      />
    </div>
  );
}

export function InfiniteTestimonialCarousel({
  testimonials,
  secondsPerLoop = 28,
}: {
  testimonials: TestimonialCardData[];
  secondsPerLoop?: number;
}) {
  const normalized = useMemo(() => {
    const cleaned = testimonials
      .filter((t) => String(t.quote ?? '').trim().length > 0)
      .map((t) => ({
        ...t,
        variant: (t.variant === 'dark' ? 'dark' : 'accent') as TestimonialVariant,
      }));

    // If we have too few items, we still want a seamless loop.
    if (cleaned.length === 0) return [];
    if (cleaned.length >= 3) return cleaned;
    return [...cleaned, ...cleaned, ...cleaned];
  }, [testimonials]);

  if (normalized.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-16 overflow-hidden">
      <style>{`
        @keyframes cc-testimonial-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="flex w-max gap-6"
        style={{
          animation: `cc-testimonial-marquee ${secondsPerLoop}s linear infinite`,
        }}
      >
        {/* Duplicate the sequence for seamless looping */}
        {Array.from({ length: 2 }).map((_, pass) => (
          <div key={pass} className="flex gap-6">
            {normalized.map((card, index) => (
              <div
                key={`${pass}-${card.id}-${index}`}
                className="min-w-[320px] max-w-[420px] flex-1"
              >
                <TestimonialCard quote={card.quote} variant={card.variant} name={card.name} role={card.role} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <span
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-24 bg-gradient-to-r from-black to-transparent lg:block"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-24 bg-gradient-to-l from-black to-transparent lg:block"
        aria-hidden="true"
      />
    </div>
  );
}
