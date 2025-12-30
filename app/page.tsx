'use client';

import { useEffect, useState } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { WhyUsSection } from '@/components/why-us-section';
import { ResumeSection } from '@/components/resume-section';
import { ServicesSection } from '@/components/services-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { HeroHighlights } from '@/components/hero-highlights';
import { VideoShowcase } from '@/components/video-showcase';

export default function Home() {
  const backgroundVideoAttributes = {
    src: 'https://framerusercontent.com/assets/yRnijo7PDqWkI1jNm8VMsqdm4.mp4',
    loop: true,
    muted: true,
    playsInline: true,
    autoPlay: true,
    preload: 'metadata' as const,
    controls: false,
    disablePictureInPicture: true,
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const MIN_LOADER_DURATION = 1500;
    const startTime = performance.now();
    let failSafeTimeoutId: number;
    let completionTimeoutId: number;
    let hasCompleted = false;

    const finishLoading = () => {
      if (hasCompleted) {
        return;
      }
      hasCompleted = true;
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, MIN_LOADER_DURATION - elapsed);
      completionTimeoutId = window.setTimeout(() => setIsLoading(false), remaining);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading, { once: true });
    }

    failSafeTimeoutId = window.setTimeout(finishLoading, 4000);

    return () => {
      window.removeEventListener('load', finishLoading);
      window.clearTimeout(failSafeTimeoutId);
      window.clearTimeout(completionTimeoutId);
    };
  }, []);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[#0e0c0c] text-white transition-opacity duration-700 ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        role="status"
        aria-live="polite"
        aria-hidden={!isLoading}
      >
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-white/60">
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-[#ff502e]" aria-hidden="true" />
          Crafting Experiences
        </div>
        <h1
          className="text-center text-4xl font-semibold sm:text-5xl"
          style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
        >
          Welcome to CoreCraft
        </h1>
        <p className="max-w-sm text-center text-base text-white/70">
          Preparing your immersive experience…
        </p>
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 animate-[spin_1.6s_linear_infinite] rounded-full border-4 border-white/15 border-t-[#ff502e]" aria-hidden="true" />
          <span className="absolute inset-2 rounded-full bg-[#ff502e]/10" aria-hidden="true" />
        </div>
      </div>

  <div className={`min-h-screen bg-black transition-opacity duration-700 ${isLoading ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`} aria-busy={isLoading}>
  <header className="relative overflow-hidden rounded-b-[70px] bg-white pb-14 text-black shadow-[0_40px_140px_-60px_rgba(200,200,200,0.5)] md:pb-20 h-screen max-h-[900px]">
          <div className="absolute inset-0 opacity-30">
            <div style={{ position: 'absolute', borderRadius: 'inherit', top: 0, right: 0, bottom: 0, left: 0 }}>
              <video
                {...backgroundVideoAttributes}
                aria-hidden="true"
                style={{ cursor: 'auto', width: '100%', height: '100%', borderRadius: '0px', display: 'block', objectFit: 'cover', backgroundColor: 'rgba(0, 0, 0, 0)', objectPosition: '50% 50%' }}
              />
            </div>
          </div>

          {/* Navigation */}
          <SiteNav logoHref="#home" />

          {/* Hero Content */}
          <div className="relative z-20 mx-auto mt-24 w-full max-w-[1240px] px-4 md:mt-28 md:px-6">
            <div className="grid gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
              {/* Left Column */}
              <div className="flex min-h-[400px] flex-col items-center justify-end pb-12 md:min-h-[500px] md:items-start md:-ml-16 lg:min-h-[600px] lg:-ml-20">
                <h1 className="text-center text-[85px] leading-[0.9] font-bold tracking-tight text-black drop-shadow-[0_18px_48px_rgba(255,255,255,0.8)] md:text-left md:text-[110px] lg:text-[135px]" style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}>
                  Create.
                  <br />
                  Refine.
                  <br />
                  Elevate.
                </h1>
              </div>

              {/* Right Column - empty to hold image space */}
              <div className="hidden md:block" />
            </div>

            {/* Feature list - Hidden but maintains spacing */}
            <div className="mt-28 md:mt-32 grid grid-cols-1 justify-items-center gap-5 text-white/90 sm:grid-cols-2 lg:grid-cols-4 invisible">
              {[
                { id: '01', title: 'Brand Strategy' },
                { id: '02', title: 'Brand Identity' },
                { id: '03', title: 'Packaging Design' },
                { id: '04', title: 'Creative Direction' },
              ].map((feature) => (
                <div
                  key={feature.id}
                  className="flex w-full max-w-[220px] flex-col items-center justify-center gap-1 rounded-[26px] border border-white/20 bg-gradient-to-br from-black/70 via-black/50 to-black/70 px-5 py-3 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-semibold text-[#ff502e]">#</span>
                    <span className="text-[28px] font-semibold text-white">{feature.id}</span>
                  </div>
                  <p className="text-[18px] font-medium text-white/90">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

  <HeroHighlights />
  <WhyUsSection />
  <VideoShowcase />
        <ResumeSection />
        <ServicesSection />
        <TestimonialsSection />

        <SiteFooter logoHref="#home" />
    </div>
    </>
  );
}
