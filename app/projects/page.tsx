'use client';

import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: 1,
    title: "Nuvé's rebrand driving 70% sales growth in just 2 years",
    slug: "premium-rebrand-elevates-nuvé-s-luxury-appeal-driving-70-sales-growth",
    image: "https://framerusercontent.com/images/fj6vHdxwJmXxa3SWyxXCZlXjk.png",
    logo: "https://framerusercontent.com/images/84YS9XgnmmKr38ktgvd84LULvQU.png",
    imagePosition: "47.7% 3.2%",
    achievements: [
      { value: "70%", label: "Increase in Sales" },
      { value: "50+", label: "Retail Partnerships" },
      { value: "5x", label: "Instagram Followers" }
    ],
    services: ["Copywriting", "Branding"]
  },
  {
    id: 2,
    title: "Bold rebrand propels Lumé to nationwide expansion",
    slug: "bold-rebrand-propels-lumé-to-nationwide-expansion",
    image: "https://framerusercontent.com/images/nGratkgH0XMxhM3liASJzgWM.png",
    logo: "https://framerusercontent.com/images/hmyQOOihiaPsEf3YIwcgMQspCc.png",
    imagePosition: "58.6% 29.1%",
    achievements: [
      { value: "$8M", label: "Secured funding" },
      { value: "3x", label: "Brand Awareness" },
      { value: "60%", label: "Growth in DTC sales" }
    ],
    services: ["Copywriting", "Pitch Deck"]
  },
  {
    id: 3,
    title: "Strategic brand revamp helps Canné secure Series A funding",
    slug: "strategic-brand-revamp-helps-canné-secure-series-a-funding",
    image: "https://framerusercontent.com/images/XhizZ9F3sgdo3v5YK01pJGqNV4.jpg",
    logo: "https://framerusercontent.com/images/MEZ9UwyZWQsHFVp14NdtVCNKnU.png",
    imagePosition: "center center",
    achievements: [
      { value: "$11.5M", label: "Series A Raised" },
      { value: "50%", label: "Increased ROI" },
      { value: "20%", label: "Increased Conversion" }
    ],
    services: ["Copywriting", "Pitch Deck", "Branding"]
  },
  {
    id: 4,
    title: "Revitalized branding helps Növa lead in clean wellness",
    slug: "revitalized-branding-helps-növa-lead-in-clean-wellness",
    image: "https://framerusercontent.com/images/KNTIAIUl3WmyGme8VhProLq0F4o.png",
    logo: "https://framerusercontent.com/images/HEfUZCGDX1mPIA99Vw1UKHD2Yhk.png",
    imagePosition: "center center",
    achievements: [
      { value: "40%", label: "Customer Retention" },
      { value: "80%", label: "Online Sales" },
      { value: "2", label: "Retail Partnerships" }
    ],
    services: ["Social Media", "Branding", "Pitch Deck", "Copywriting"]
  },
  {
    id: 5,
    title: "Strategic refresh fuels Auro's global expansion",
    slug: "strategic-refresh-fuels-auro-s-global-expansion",
    image: "https://framerusercontent.com/images/2TIXd5xRqy9fxtiHqBQ0DF9VMh8.png",
    logo: "https://framerusercontent.com/images/VChslkFrmJjtjf93Ao3JWpmBtE.png",
    imagePosition: "center center",
    achievements: [
      { value: "5x", label: "Brand Visibility" },
      { value: "$15M", label: "Series A Funding" },
      { value: "5", label: "International Markets" }
    ],
    services: ["Social Media"]
  },
  {
    id: 6,
    title: "Luxe rebrand helps Véra Beauty triple its market share",
    slug: "luxe-rebrand-helps-véra-beauty-triple-its-market-share",
    image: "https://framerusercontent.com/images/83ZEeWaaJ93iBcgsVVkIUl2QA.png",
    logo: "https://framerusercontent.com/images/gZnNziNw5tScGjxf8SmNEwAw.png",
    imagePosition: "center center",
    achievements: [
      { value: "3x", label: "Market Growth" },
      { value: "65%", label: "Higher AOV" },
      { value: "20+", label: "Retail Stores" }
    ],
    services: ["Pitch Deck", "Branding"]
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Image and Title */}
      <div className="relative h-[400px] w-full overflow-hidden md:h-[450px] lg:h-[500px]">
        {/* Background Image */}
        <Image
          src="https://framerusercontent.com/images/wUatyS07We1puzzPLO6XxWqf5Mk.jpg"
          alt="Projects Header"
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation */}
        <div className="relative z-50">
          <SiteNav logoHref="/" forceFloating={true} />
        </div>

        {/* Page Title - Overlaid on Image */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pt-20 md:pt-0">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="space-y-3 text-center">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-black md:text-6xl lg:text-7xl" style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}>
                Projects
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
                A closer look at selection of our most impactful projects, where strategy, creativity, and innovation come together to drive real results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-4 pt-4 pb-16 md:px-8 md:pt-6 md:pb-24">

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] transition-all duration-300 hover:shadow-[0_14px_40px_0_rgba(100,100,111,0.3)]">
                {/* Image Section */}
                <div className="relative h-[300px] overflow-hidden md:h-[350px]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: project.imagePosition }}
                  />
                  {/* Arrow Button */}
                  <div className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="h-6 w-6 text-black" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  {/* Logo and Title */}
                  <div className="mb-6 space-y-4">
                    <div className="relative h-[60px] w-[100px]">
                      <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-black md:text-2xl">
                      {project.title}
                    </h3>
                  </div>

                  {/* Achievements */}
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    {project.achievements.map((achievement, i) => (
                      <div key={i} className="space-y-1">
                        <h4 className="text-2xl font-bold text-black md:text-3xl">
                          {achievement.value}
                        </h4>
                        <p className="text-xs text-gray-500 md:text-sm">
                          {achievement.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mb-6 h-px bg-gray-300" />

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="rounded-full border-gray-300 bg-transparent px-4 py-1 text-sm text-gray-500 hover:bg-gray-50"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer cover spacer */}
        <div className="h-32" />
      </section>

      {/* Footer */}
      <SiteFooter logoHref="/" />
    </div>
  );
}
