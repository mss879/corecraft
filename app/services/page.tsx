'use client';

import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { ProcessSection } from '@/components/services/process-section';
import {
  BadgeCheck,
  Megaphone,
  Search,
  Target,
  MonitorSmartphone,
  PenTool,
  Clapperboard,
  Palette,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Cog,
  Lightbulb,
} from 'lucide-react';
import type { ReactNode } from 'react';

const accentColor = '#ff502e';

type ServiceCard = {
  id: string;
  accent: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  features: string[];
  icon: ReactNode;
};

const serviceCards: ServiceCard[] = [
  {
    id: 'brand-identity',
    accent: 'Brand',
    title: 'Identity',
    description: 'Crafting visuals that define who you are.',
    metricLabel: 'Clients see higher recognition after rebranding.',
    metricValue: '90%',
    features: ['Logo Design', 'Color System', 'Brand Guidelines', 'Social Templates', 'Graphic Assets', 'Typography'],
    icon: <BadgeCheck className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'social-media',
    accent: 'Social',
    title: 'Media',
    description: 'Building presence where your audience lives.',
    metricLabel: 'Boost engagement with targeted campaigns by',
    metricValue: '3x',
    features: ['Brand Collabs', 'Content Strategy', 'Paid Ads', 'Campaign Design', 'Ads Tracking', 'Build In Public'],
    icon: <Megaphone className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'seo-optimization',
    accent: 'SEO',
    title: 'Optimization',
    description: 'Making sure your brand gets found first.',
    metricLabel: 'Rank on page #1 and grow organic traffic by',
    metricValue: '250%',
    features: ['On-page SEO', 'Link Building', 'Keyword Research', 'Local SEO', 'Technical SEO', 'Growth Tracking'],
    icon: <Search className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'conversion-strategy',
    accent: 'Conversion',
    title: 'Strategy',
    description: 'Our goal is to turn visitors into loyal customers.',
    metricLabel: 'Average ROI increase of 5x within the first 90 days.',
    metricValue: '5x',
    features: ['Funnel Design', 'CRO Testing', 'Landing Pages', 'Retargeting Ads', 'A/B Testing', 'Analytics Setup'],
    icon: <Target className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'website-development',
    accent: 'Website',
    title: 'Development',
    description: 'Sites built to inspire and perform better.',
    metricLabel: 'Reduce bounce rates with high-converting design by',
    metricValue: '60%',
    features: ['Custom Layouts', 'Animations', 'Responsive Design', 'SEO-Friendly Build', 'CMS Setup', 'Fast Hosting'],
    icon: <MonitorSmartphone className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'content-production',
    accent: 'Content',
    title: 'Production',
    description: 'Creative posts that connect and convert.',
    metricLabel: 'Our clients work with us again because of consistent results.',
    metricValue: '90%',
    features: ['Copywriting', 'Video Scripts', 'Blog Writing', 'Content Strategy & Marketing', 'Ad Creatives', 'Motion Graphics'],
    icon: <PenTool className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'video-production',
    accent: 'Video',
    title: 'Production',
    description: 'Professional video content creation from concept to final cut.',
    metricLabel: 'Increase watch-through rates across campaigns by',
    metricValue: '65%',
    features: ['Concept Development', 'Scriptwriting', 'On-Set Direction', 'Studio & Remote Shoots', 'Post-Production', 'Social Media Cuts'],
    icon: <Clapperboard className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'creative-design',
    accent: 'Creative',
    title: 'Design',
    description: 'Visual systems, collateral, and illustrations that communicate with impact.',
    metricLabel: 'Campaign recall improves on average by',
    metricValue: '2.3x',
    features: ['Graphic Systems', 'Marketing Collateral', 'Presentation Design', 'Infographics', 'Digital Illustration', 'Print Assets'],
    icon: <Palette className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'web-optimization',
    accent: 'Web',
    title: 'Optimization',
    description: 'Performance tuning that keeps sites fast, accessible, and conversion ready.',
    metricLabel: 'Average load times reduced by',
    metricValue: '48%',
    features: ['Core Web Vitals', 'Conversion Rate Optimization', 'Mobile Responsiveness', 'Technical Audits', 'Speed Enhancements', 'Analytics Readiness'],
    icon: <Cog className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'ui-ux-design',
    accent: 'UI/UX',
    title: 'Design',
    description: 'Human-centered experiences balanced between utility and delight.',
    metricLabel: 'User task completion rates increase by',
    metricValue: '45%',
    features: ['User Research', 'Journey Mapping', 'Wireframing', 'Interactive Prototypes', 'Usability Testing', 'Design Systems'],
    icon: <LayoutDashboard className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'digital-advertising',
    accent: 'Digital',
    title: 'Advertising',
    description: 'Paid acquisition strategies that scale what works across every channel.',
    metricLabel: 'Return on ad spend typically improves by',
    metricValue: '3.8x',
    features: ['Google Ads', 'Paid Social', 'Display Networks', 'Retargeting Sequences', 'Creative Iteration', 'Live Optimization'],
    icon: <BarChart3 className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'professional-branding',
    accent: 'Career',
    title: 'Branding',
    description: 'LinkedIn and resume polish that puts your story in front of decision makers.',
    metricLabel: 'Interview callback rates increase on average by',
    metricValue: '70%',
    features: ['LinkedIn Optimization', 'Thought Leadership Guides', 'Networking Playbooks', 'Resume & CV Crafting', 'Executive Bios', 'Outreach Messaging'],
    icon: <Briefcase className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'business-automation',
    accent: 'Operational',
    title: 'Automation',
    description: 'Streamlining processes with smart tooling and change management.',
    metricLabel: 'Teams reclaim upwards of',
    metricValue: '40h',
    features: ['Workflow Mapping', 'Automation Builds', 'Tool Integrations', 'Training & Enablement', 'Documentation', 'Performance Dashboards'],
    icon: <Cog className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: 'digital-consultation',
    accent: 'Digital',
    title: 'Consultation',
    description: 'Strategic advisory that aligns technology, teams, and growth roadmaps.',
    metricLabel: 'Roadmap adoption success rates average',
    metricValue: '92%',
    features: ['Technology Audits', 'Transformation Strategy', 'Competitive Benchmarking', 'Capability Roadmaps', 'Budget Prioritization', 'Executive Workshops'],
    icon: <Lightbulb className="h-6 w-6" aria-hidden="true" />,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] text-black">
      <SiteNav logoHref="/" forceFloating />

      <main className="mx-auto max-w-[1240px] px-4 pt-36 pb-24 md:px-8 md:pt-40">
        <section className="relative overflow-hidden rounded-[42px] bg-white px-6 py-14 shadow-[0_32px_120px_-60px_rgba(15,15,15,0.25)] md:px-10 md:py-16">
          <span className="absolute left-8 top-10 h-3 w-3 rounded-full bg-[#ff4d8d]" aria-hidden="true" />
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="text-sm font-semibold uppercase tracking-[0.4em] text-neutral-500">
                Our Services
              </span>
              <h1
                className="text-4xl font-semibold leading-[1.05] text-black md:text-5xl lg:text-[58px]"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Full-Service Agency Work
              </h1>
            </div>
            <p className="max-w-xl text-base text-neutral-600 md:text-lg">
              We offer comprehensive digital agency solutions designed to build, strengthen, and scale your brand in the modern marketplace.
            </p>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((service) => (
            <article
              key={service.id}
              className="flex h-full flex-col gap-8 rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_-60px_rgba(15,15,15,0.45)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_38px_90px_-50px_rgba(15,15,15,0.35)] md:p-8"
            >
              <div className="space-y-4">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                  Features in this service area
                </span>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                    {service.icon}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2 text-2xl font-semibold md:text-[26px]">
                    <span style={{ color: accentColor }}>{service.accent}</span>
                    <span>{service.title}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 md:text-base">{service.description}</p>
              </div>

              <div className="h-px bg-neutral-200" aria-hidden="true" />

              <div className="flex items-end justify-between gap-6">
                <p className="max-w-[70%] text-xs text-neutral-500 md:text-sm">{service.metricLabel}</p>
                <span
                  className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl"
                  style={{ fontFamily: '"Familjen Grotesk", "Familjen Grotesk Placeholder", sans-serif' }}
                >
                  {service.metricValue}
                </span>
              </div>
            </article>
          ))}
        </section>

        {/* Process Section */}
        <div className="mt-16 md:mt-24 lg:mt-32">
          <ProcessSection />
        </div>
      </main>

      <SiteFooter logoHref="/" />
    </div>
  );
}
