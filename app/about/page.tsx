'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Libre_Caslon_Text } from 'next/font/google';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { cn } from '@/lib/utils';

const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'] });

const accent = '#ff502e';

export default function AboutPage() {
  return (
    <>
      <SiteNav logoHref="/" forceFloating />
      <main className="bg-black text-white">
        {/* Section 1: Hero / Intro */}
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"
              alt="Abstract dark fluid background"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
              <div className="mb-6 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                <span className="h-px w-8 bg-[#ff502e]" />
                <span>About Core Craft</span>
                <span className="h-px w-8 bg-[#ff502e]" />
              </div>
              
              <h1 className={cn(libreCaslon.className, "mb-8 text-5xl font-light leading-tight tracking-tight text-white sm:text-7xl md:text-8xl")}>
                Create. Refine. <br />
                <span className="italic text-[#ff502e]">Elevate.</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl md:text-2xl">
                Every meaningful brand starts with a clear idea.
                <br />
                Our role is to help it take shape.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Process & Philosophy */}
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left Column: Content */}
              <div className="flex flex-col justify-center space-y-12">
                <div className="space-y-6">
                  <h2 className={cn(libreCaslon.className, "text-4xl font-light text-white sm:text-5xl")}>
                    Complexity into <span className="italic text-[#ff502e]">Clarity</span>
                  </h2>
                  <p className="text-lg leading-relaxed text-white/70">
                    Core Craft is a global digital studio working with founders, professionals, and businesses who care deeply about how their work is presented to the world. We help turn ideas into brands, complexity into clarity, and ambition into systems that scale.
                  </p>
                </div>

                <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    Our process is simple by design
                  </h3>
                  <ul className="space-y-6">
                    {[
                      { title: 'We listen first', desc: 'Understanding your vision is the foundation.' },
                      { title: 'We think carefully', desc: 'Strategy before execution, always.' },
                      { title: 'We craft with purpose', desc: 'Every pixel and line of code has a reason.' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#ff502e] text-[#ff502e]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <strong className="block text-lg font-medium text-white">{item.title}.</strong>
                          <span className="text-white/60">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] border border-white/10 lg:aspect-auto">
                <Image
                  src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"
                  alt="Abstract geometric shapes"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm font-medium uppercase tracking-widest text-white/80">
                    Tailored, never templated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Approach / Conclusion */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#ff502e]/5 blur-[120px]" />

          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[48px] bg-[#111] px-6 py-16 sm:px-12 sm:py-24 md:px-20">
              {/* Background Image for Card */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
                  alt="Digital network background"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <p className="mb-8 text-lg font-light leading-relaxed text-white/80 sm:text-xl">
                  From brand identity and digital experiences to performance marketing and automation, everything we build is tailored, never templated. We refine until it feels right, then elevate it so it performs in the real world.
                </p>
                
                <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <h2 className={cn(libreCaslon.className, "mb-6 text-4xl font-light text-white sm:text-5xl")}>
                  No noise. No shortcuts.
                  <br />
                  <span className="text-[#ff502e]">Just thoughtful work, done properly.</span>
                </h2>

                <div className="mt-12 flex flex-col items-center justify-center gap-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                    This is the art of building with intent
                  </p>
                  <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    <span className="h-2 w-2 rounded-full bg-[#ff502e]" />
                    This is Core Craft.
                  </div>
                  
                  <a 
                    href="/contact" 
                    className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
                  >
                    Start a Project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
