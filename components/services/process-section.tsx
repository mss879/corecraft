'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
};

const processSteps: ProcessStep[] = [
  {
    id: 'process-1',
    number: '01',
    title: 'Deep Discovery',
    description: 'We dive into your brand, goals, audience, and existing data to uncover growth opportunities.',
    image: 'https://framerusercontent.com/images/y6Gr4wAXNNE6q5Q9m95HrrGdBcI.png',
  },
  {
    id: 'process-2',
    number: '02',
    title: 'Strategic Planning',
    description: 'We create a tailored marketing plan with clear objectives, channel selection, and creative direction.',
    image: 'https://framerusercontent.com/images/zi1GR78wfefPJJD4QRkk4YgrE.png',
  },
  {
    id: 'process-3',
    number: '03',
    title: 'Flawless Execution',
    description: 'We launch, optimize, and scale your campaigns with performance-driven creative and constant testing.',
    image: 'https://framerusercontent.com/images/iBu4oZZrFRRoIDVc6VeXsqAINCQ.png',
  },
];

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-black py-12 text-white md:rounded-[48px] md:py-16 lg:rounded-[64px] lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-12">
          {/* Heading with decorative elements */}
          <div className="flex-1 space-y-2">
            <div className="relative">
              {/* Decorative dots background */}
              <div className="absolute -left-8 top-0 flex gap-2 opacity-30">
                {[0.36, 0.3, 0.25, 0.2, 0.16, 0.12, 0.09].map((opacity, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-white"
                    style={{ opacity }}
                  />
                ))}
              </div>
              
              {/* Heading text */}
              <div className="space-y-2">
                <h2 className="text-4xl font-bold opacity-40 md:text-5xl lg:text-6xl">
                  Our
                </h2>
                <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                  step-by-step process
                </h2>
              </div>
            </div>
            
            <p className="max-w-2xl text-base text-white/90 md:text-lg">
              First, we audit your brand and goals. You get full transparency, fast turnarounds, and results that speak for themselves.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-0 overflow-hidden rounded-full bg-white transition-all hover:shadow-lg"
          >
            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-black transition-all group-hover:w-20">
              <ArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
            </div>
            <span className="pr-6 pl-4 font-medium text-black">Start Bold Today</span>
          </Link>
        </div>

        {/* Process Steps */}
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              id={step.id}
              className="relative flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
            >
              {/* Progress Bar */}
              <div className="relative flex flex-row items-center gap-4 md:flex-col md:items-center md:gap-0">
                {/* Dot */}
                <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-white opacity-80" />
                </div>
                
                {/* Vertical line (hidden on mobile, shown on desktop) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block md:h-full md:w-px md:bg-white/20">
                    <div 
                      className="w-full bg-white transition-all duration-1000"
                      style={{ height: '100%' }}
                    />
                  </div>
                )}
                
                {/* Horizontal line on mobile */}
                {index < processSteps.length - 1 && (
                  <div className="h-px flex-1 bg-white/20 md:hidden" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1">
                <div 
                  className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-700/60 to-neutral-800/60 p-1"
                  style={{
                    background: 'linear-gradient(282deg, rgb(69, 69, 69) 0%, rgba(238, 238, 238, 0.6) 100%)',
                  }}
                >
                  <div className="rounded-[22px] bg-[#111] p-6 md:p-8">
                    <div className="space-y-6">
                      {/* Step number and image */}
                      <div className="flex items-start gap-6">
                        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl">
                          {step.number}
                        </h1>
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl md:h-32 md:w-32 lg:h-40 lg:w-40">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="space-y-3">
                        <h5 className="text-2xl font-semibold text-white md:text-3xl">
                          {step.title}
                        </h5>
                        <p className="text-sm text-neutral-300/90 md:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
