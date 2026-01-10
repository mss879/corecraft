"use client";

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';
import { InfiniteTestimonialCarousel, type TestimonialCardData } from '@/components/testimonial-cards';

const accent = '#ff502e';

const avatarImages = [
  'https://framerusercontent.com/images/5U7azVaVT6ogBk23qZv9AtdLy5c.png?scale-down-to=256',
  'https://framerusercontent.com/images/9o1cahhgEtzdulbyZpMfgf26Z5w.png?scale-down-to=256',
  'https://framerusercontent.com/images/My19q8uLsyh2zA7lcXTwPNtv5RM.jpg?scale-down-to=256',
  'https://framerusercontent.com/images/7dBgVlJGddtanMmE6mro8bfVO8.png?scale-down-to=256',
];

const testimonialFallback: TestimonialCardData[] = [
  {
    id: 'emma-collins',
    quote:
      'CoreCraft transformed our brand identity and website beyond what we imagined. Their team was professional, creative, and delivered on time. Our online presence has never looked better.',
    name: 'Emma Collins',
    role: 'Marketing Lead',
    variant: 'dark',
  },
  {
    id: 'michael-brooks',
    quote:
      'CoreCraft revamped our online store with a sleek design that resonates with customers. Since launch, engagement and user experience have greatly improved.',
    name: 'Michael Brooks',
    role: 'Ecommerce Manager',
    variant: 'accent',
  },
  {
    id: 'liam-torres',
    quote:
      'Our clean, intuitive website now showcases our SaaS platform perfectly, leading to increased sign-ups and higher customer satisfaction.',
    name: 'Liam Torres',
    role: 'Founder',
    variant: 'accent',
  },
];

const performanceMetrics = [
  {
    id: 'metric-001',
    value: '2.1s',
  description: "Average page load time across all client websites we've deployed",
  },
  {
    id: 'metric-002',
    value: '18+',
  description: 'Countries where brands use websites built by CoreCraft',
  },
  {
    id: 'metric-003',
    value: '72%',
  description: 'Average improvement in conversion rates after a CoreCraft-led redesign',
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialCardData[]>(testimonialFallback);

  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, name, role, variant, published, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      if (error) return;

      const mapped = (data ?? []).map((row: any) => ({
        id: String(row.id),
        quote: String(row.quote ?? ''),
        name: row.name == null ? null : String(row.name),
        role: row.role == null ? null : String(row.role),
        variant: (row.variant === 'dark' ? 'dark' : 'accent') as 'dark' | 'accent',
      })) as TestimonialCardData[];

      if (mapped.length > 0) {
        setTestimonials(mapped);
      }
    }

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleTestimonials = useMemo(() => testimonials.filter((t) => t.quote.trim().length > 0), [testimonials]);

  const carouselTestimonials = useMemo(
    () => visibleTestimonials.map((t) => ({ ...t, variant: 'accent' as const })),
    [visibleTestimonials]
  );

  return (
    <section id="testimonials" className="relative overflow-hidden bg-black py-24 text-white md:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
              <span className="h-1 w-8 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
              <span className="text-white">005</span>
              <span>Testimonials</span>
            </div>
            <div className="space-y-3">
              <h2
                className="text-[44px] font-semibold tracking-tight md:text-5xl lg:text-[56px]"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Client <span className="text-white/60">stories.</span>
              </h2>
              <p className="max-w-xl text-sm text-white/60 md:text-base lg:max-w-2xl">
                Hear directly from our clients about their experience with CoreCraft—from seamless collaboration to impactful design solutions that elevate their brands.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:items-end">
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatarImages.map((src, index) => (
                  <span
                    key={src}
                    className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/50 bg-black"
                    style={{ zIndex: avatarImages.length - index }}
                  >
                    <img src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
                  </span>
                ))}
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black text-sm font-semibold">
                  95+
                </span>
              </div>
            </div>
            <p className="max-w-[220px] text-sm text-white/60 md:max-w-xs">We&apos;ve successfully completed 95+ projects.</p>
          </div>
        </div>

        <InfiniteTestimonialCarousel testimonials={carouselTestimonials} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.2fr)]">
          {performanceMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#121212] px-8 py-10 sm:px-10"
            >
              <span className="text-5xl font-semibold leading-none md:text-6xl">{metric.value}</span>
              <p className="mt-6 text-sm text-white/60 md:text-base">{metric.description}</p>
            </div>
          ))}

          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#121212] px-8 py-10 sm:px-10">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                <span>CoreCraft</span>
                <span className="text-white/40">®</span>
              </div>
              <p className="text-base text-white/70">
                If you&apos;ve enjoyed working with us, we&apos;d love to hear from you — leave a review and help others discover CoreCraft.
              </p>
            </div>
            <a
              href="./contact"
              className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
            >
              Leave a review
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                style={{ backgroundColor: accent }}
              >
                <ArrowUpRight className="h-5 w-5 text-black" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
