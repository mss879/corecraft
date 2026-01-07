'use client';

import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TestimonialCard, type TestimonialCardData } from '@/components/testimonial-cards';

interface Project {
  id: string;
  title: string;
  slug: string;
  image: string;
  logo: string;
  imagePosition: string;
  achievements: { value: string; label: string }[];
  services: string[];
}

export default function ProjectsPageClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'client_stories'>('projects');

  const clientStoriesTestimonials = useMemo(() => {
    return testimonials.map((t) => ({
      ...t,
      variant: 'accent' as TestimonialCardData['variant'],
    }));
  }, [testimonials]);

  const clientStoriesGrid = useMemo(() => clientStoriesTestimonials.slice(0, 9), [clientStoriesTestimonials]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching projects:', error);
        } else if (data) {
          const mappedProjects = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            image: p.image_url,
            logo: p.logo_url,
            imagePosition: p.image_position || 'center center',
            achievements: p.achievements || [],
            services: p.services || []
          }));
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, name, role, variant, published, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) return;

      const mapped = (data ?? []).map((row: any) => ({
        id: String(row.id),
        quote: String(row.quote ?? ''),
        name: row.name ?? null,
        role: row.role ?? null,
        variant: (row.variant === 'dark' ? 'dark' : 'accent') as 'dark' | 'accent',
      })) as TestimonialCardData[];

      setTestimonials(mapped);
    }

    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Image and Title */}
      <div className="relative h-[400px] w-full overflow-hidden md:h-[450px] lg:h-[500px]">
        {/* Background Image */}
        <Image
          src="https://framerusercontent.com/images/wUatyS07We1puzzPLO6XxWqf5Mk.jpg"
          alt="CoreCraft Successful Career Projects & Case Studies"
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
              <h1
                className="text-5xl font-bold leading-tight tracking-tight text-black md:text-6xl lg:text-7xl"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Success Stories & Projects
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
                Explore our impactful career transformations, resume makeovers, and digital branding projects that drive real results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-4 pt-4 pb-16 md:px-8 md:pt-6 md:pb-24">
        <div className="mb-10 flex items-center justify-center">
          <div className="flex flex-wrap items-center gap-3 rounded-[999px] border border-black/10 bg-white p-2 text-sm shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
            {[{ id: 'projects', label: 'Projects' }, { id: 'client_stories', label: 'Client Stories' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-5 py-2 font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'client_stories' && (
          <section className="rounded-3xl bg-black px-4 py-14 text-white md:px-10">
            <div className="mx-auto max-w-[1120px]">
              <h2
                className="text-center text-4xl font-semibold tracking-tight md:text-5xl"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Client <span className="text-white/60">stories.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/60 md:text-base">
                Testimonials from clients about working with CoreCraft.
              </p>
              <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {clientStoriesGrid.map((t) => (
                  <TestimonialCard key={t.id} quote={t.quote} variant={t.variant} name={t.name} role={t.role} />
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Projects Grid */}
        {activeTab === 'projects' && (loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
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
        ))}

        {/* Footer cover spacer */}
        <div className="h-32" />
      </section>

      {/* Footer */}
      <SiteFooter logoHref="/" />
    </div>
  );
}
