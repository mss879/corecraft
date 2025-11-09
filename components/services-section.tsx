'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';

const accentColor = '#ff502e';

const services = [
  {
    id: '001',
    title: 'Video Production',
    summary:
      'Professional video content from concept to final cut—promotional videos, corporate presentations, product demos, and social media content that captivates and converts.',
    description:
      'Professional video content from concept to final cut—promotional videos, corporate presentations, product demos, and social media content that captivates and converts. We handle scripting, production, and post to deliver polished visuals for every channel.',
    ctaHref: './contact',
  },
  {
    id: '002',
    title: 'Branding & Brand Identity',
    summary:
      'Strategic brand development including logo design, visual identity systems, and brand messaging that creates memorable, cohesive experiences.',
    description:
      'Strategic brand development including logo design, visual identity systems, and brand messaging that creates memorable, cohesive experiences. We build toolkits that keep every touchpoint aligned and unmistakably you.',
    ctaHref: './contact',
  },
  {
    id: '003',
    title: 'Creative Design',
    summary:
      'Stunning visual design—graphics, marketing collateral, presentations, and digital illustrations that communicate with impact.',
    description:
      'Stunning visual design—graphics, marketing collateral, presentations, and digital illustrations that communicate with impact. We translate ideas into visuals that feel premium on every platform.',
    ctaHref: './contact',
  },
  {
    id: '004',
    title: 'Web Development & Optimization',
    summary:
      'Custom, responsive websites backed by relentless performance tuning—experience design, build, and optimization in one streamlined partnership.',
    description:
      'Custom, responsive websites built with cutting-edge technology, paired with ongoing optimization for speed, accessibility, and conversions. From CMS builds to performance audits, we engineer seamless experiences that keep improving.',
    ctaHref: './contact',
  },
  {
    id: '005',
    title: 'SEO & Content Strategy',
    summary:
      'Data-led SEO paired with channel-tailored content that builds authority, boosts organic visibility, and nurtures demand.',
    description:
      'Data-driven strategies that improve rankings and grow organic traffic, backed by editorial calendars, brand storytelling, and multi-channel content. We align search intent with thought leadership so every asset pulls its weight.',
    ctaHref: './contact',
  },
  {
    id: '006',
    title: 'UI/UX Design',
    summary:
      'User-centered design that balances aesthetics with functionality. Intuitive, engaging digital experiences through research, prototyping, and testing.',
    description:
      'User-centered design that balances aesthetics with functionality. Intuitive, engaging digital experiences through research, prototyping, and testing that keep users coming back.',
    ctaHref: './contact',
  },
  {
    id: '007',
    title: 'Digital Advertising',
    summary:
      'Targeted campaigns across Google Ads, social media, and display networks designed to maximize ROI.',
    description:
      'Targeted campaigns across Google Ads, social media, and display networks designed to maximize ROI. We optimize spend, iterate creative, and scale what converts.',
    ctaHref: './contact',
  },
  {
    id: '008',
    title: 'LinkedIn Optimization & Resume Building',
    summary:
      'Personal brand polish that elevates your LinkedIn presence and resume—designed to open doors and spark conversations.',
    description:
      'Expert profile optimization and resume crafting that maximize visibility, expand your network, and present your value with clarity. We fine-tune messaging, narrative, and calls-to-action so opportunities find you first.',
    ctaHref: './contact',
  },
  {
    id: '009',
    title: 'Business Streamlining & Automation',
    summary:
      'Process optimization and automation that eliminates inefficiencies and frees your team for strategic growth.',
    description:
      'Process optimization and automation that eliminates inefficiencies and frees your team for strategic growth. We map workflows, introduce the right tools, and ensure adoption sticks.',
    ctaHref: './contact',
  },
  {
    id: '010',
    title: 'Digital Consultation',
    summary:
      'Strategic advisory on technology adoption, digital transformation, and competitive positioning in the modern marketplace.',
    description:
      'Strategic advisory on technology adoption, digital transformation, and competitive positioning in the modern marketplace. Partner with us to prioritize roadmaps and unlock new opportunities.',
    ctaHref: './contact',
  },
] as const;

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-black py-24 text-white md:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
              <span className="h-1 w-8 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
              <span className="text-white">003</span>
              <span>Services</span>
            </div>
            <div className="space-y-3">
              <h2
                className="text-[44px] font-semibold tracking-tight md:text-5xl lg:text-[56px]"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Services<span className="text-white/60">.</span>
              </h2>
            </div>
          </div>
          <p className="max-w-xl text-sm text-white/60 md:text-base lg:max-w-lg">
            Explore how our design solutions shape strong brands, create engaging experiences, and deliver lasting impact across industries.
          </p>
        </div>

        <Accordion.Root
          type="single"
          collapsible
          className="mt-16 divide-y divide-white/10 border-y border-white/10"
        >
          {services.map((service) => (
            <Accordion.Item key={service.id} value={service.id} className="border-white/10">
              <Accordion.Header>
                <Accordion.Trigger
                  className="group flex w-full flex-col gap-6 py-8 text-left transition-colors duration-300 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff502e] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                    <div className="flex w-full items-start gap-4 md:items-center">
                      <div className="flex flex-1 min-w-0 items-baseline gap-3 md:gap-6">
                        <div className="flex items-baseline gap-2 text-xs uppercase tracking-[0.35em] text-white/60">
                          <span className="text-base font-medium text-white md:text-lg">{service.id}</span>
                          <span style={{ color: accentColor }}>/</span>
                        </div>
                        <h3
                          className="min-w-0 text-2xl font-semibold leading-tight text-white md:text-[32px]"
                          style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
                        >
                          {service.title}
                        </h3>
                      </div>
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors duration-300 group-data-[state=open]:bg-[rgb(255,80,46)] group-data-[state=open]:text-black"
                        aria-hidden="true"
                      >
                        <Plus className="h-5 w-5 group-data-[state=open]:hidden" />
                        <Minus className="hidden h-5 w-5 group-data-[state=open]:block" />
                      </span>
                    </div>
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-white/70 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="space-y-6 pb-10 pl-4 pr-4 text-sm md:pl-28 md:pr-8 md:text-base">
                  <p className="max-w-3xl text-white/60">{service.summary}</p>
                  <p className="max-w-3xl leading-relaxed">{service.description}</p>
                  <a
                    href={service.ctaHref}
                    className="group inline-flex w-max items-center gap-3 rounded-full bg-[rgb(255,80,46)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-black transition-transform duration-300 hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    Get started
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
