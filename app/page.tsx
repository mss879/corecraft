'use client';

import { Fragment, useEffect, useState } from 'react';
import type { ReactNode, SVGProps } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import StaggeredMenu from '@/components/staggered-menu';
import { WhyUsSection } from '@/components/why-us-section';
import { ServicesSection } from '@/components/services-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { HeroHighlights } from '@/components/hero-highlights';

const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    focusable="false"
    aria-hidden="true"
    {...props}
  >
    <path d="M15.75 3h3.04a5.34 5.34 0 0 0 5.21 5.36v3.07a8.29 8.29 0 0 1-5.03-1.63v7.02a6.12 6.12 0 1 1-6.12-6.12h1.83v3.09h-1.83a3.03 3.03 0 1 0 3.03 3.03V3Z" fill="currentColor" />
  </svg>
);

export default function Home() {
  const primaryLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PORTFOLIO', href: '#portfolio' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const menuLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'SERVICES', href: '#services' },
  ];

  const staggeredMenuItems = [...menuLinks, ...primaryLinks].map((link) => ({
    label: link.label,
    ariaLabel: `Navigate to ${link.label.toLowerCase()} section`,
    link: link.href,
  }));

  const companyLinks = [
    { label: 'Home', href: 'https://mandala.framer.website/?utm_source=framer' },
    { label: 'Projects', href: 'https://mandala.framer.website/projects?utm_source=framer' },
    { label: 'About Us', href: 'https://mandala.framer.website/about-us?utm_source=framer' },
    { label: 'Blog', href: 'https://mandala.framer.website/blog?utm_source=framer' },
    { label: 'Contact Us', href: 'https://mandala.framer.website/contact?utm_source=framer' },
    { label: '404', href: 'https://mandala.framer.website/404?utm_source=framer' },
  ];

  const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: <Instagram aria-hidden="true" focusable="false" />,
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      icon: <Facebook aria-hidden="true" focusable="false" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/velox-themes/',
      icon: <Linkedin aria-hidden="true" focusable="false" />,
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@corecraft',
      icon: <TikTokIcon aria-hidden="true" focusable="false" />,
    },
    {
      label: 'X/Twitter',
      href: 'https://x.com/VeloxThemes',
      icon: <Twitter aria-hidden="true" focusable="false" />,
    },
  ];

  const staggeredSocialItems = socialLinks.map((link) => ({
    label: link.label,
    link: link.href,
    icon: link.icon,
  }));

  const legalLinks = [
    { label: 'Privacy Policy', href: 'https://mandala.framer.website/legal/privacy-policy?utm_source=framer' },
    { label: 'Terms of Service', href: 'https://mandala.framer.website/legal/terms-of-service?utm_source=framer' },
  ];

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
  const [isNavFloating, setIsNavFloating] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsNavFloating(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinkClasses = 'text-lg font-extrabold tracking-[0.2em] text-black transition-colors duration-300 hover:text-gray-700';

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
          <nav
            className={cn(
              'fixed inset-x-0 top-0 z-40 w-full transition-all duration-500',
              isNavFloating ? 'px-4 pt-4' : 'bg-transparent'
            )}
          >
            <div className="relative w-full">
              <div
                className={cn(
                  'pointer-events-none absolute left-1/2 top-1/2 z-0 h-[74px] w-full max-w-[1240px] -translate-x-1/2 -translate-y-1/2 rounded-[36px] border border-black/5 bg-white shadow-[0_28px_70px_-48px_rgba(0,0,0,0.65)] transition-all duration-500',
                  isNavFloating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                )}
              />
              <div
                className={cn(
                  'relative z-10 flex w-full items-center justify-between transition-all duration-500',
                  isNavFloating
                    ? 'mx-auto h-[74px] max-w-[1240px] px-4 md:px-8'
                    : 'h-20 px-4 pt-8 md:px-6 lg:h-24'
                )}
              >
              <a
                href="#home"
                className={cn('flex items-center', isNavFloating ? 'mr-auto flex-shrink-0 md:mr-0' : '')}
              >
                <Image
                  src="/Copy of CoreCraft Logo.png"
                  alt="CoreCraft logo"
                  width={220}
                  height={70}
                    className={cn(
                      'w-auto transition-all duration-300',
                      isNavFloating ? 'h-[64px]' : 'h-16 lg:h-[82px]'
                    )}
                  priority
                />
              </a>

                {!isNavFloating && (
                  <div className="hidden items-center space-x-16 transition-all duration-300 md:flex">
                    {primaryLinks.map((link) => (
                      <a key={link.label} className={navLinkClasses} href={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}

                <div
                  className={cn(
                    'relative w-[150px] transition-all duration-300',
                    isNavFloating ? 'ml-auto h-[70px] flex-shrink-0 md:ml-0' : 'h-20'
                  )}
                >
                  <StaggeredMenu
                    key={isNavFloating ? 'floating-menu' : 'default-menu'}
                    className="h-full w-full"
                    items={staggeredMenuItems}
                    socialItems={staggeredSocialItems}
                    position="right"
                    colors={['#1b1818', '#221d1d', '#282222', '#2f2626']}
                    accentColor="#ff502e"
                    menuButtonColor={isNavFloating ? '#101010' : '#100e0e'}
                    openMenuButtonColor="#ff502e"
                    displaySocials
                    displayItemNumbering
                    isFixed
                    logoUrl="/Copy of CoreCraft Logo.png"
                    onMenuOpen={() => {
                      document.documentElement.classList.add('overflow-hidden');
                    }}
                    onMenuClose={() => {
                      document.documentElement.classList.remove('overflow-hidden');
                    }}
                  />
                </div>
              </div>
            </div>
          </nav>

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
  <ServicesSection />
  <TestimonialsSection />

        <footer className="relative isolate overflow-hidden bg-[#100e0e] text-white">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.2,
            maskImage: 'radial-gradient(45% 44% at 52.1% 45.7%, rgba(0,0,0,0.68) 51%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'radial-gradient(45% 44% at 52.1% 45.7%, rgba(0,0,0,0.68) 51%, rgba(0,0,0,0) 100%)',
          }}
        >
          <video
            {...backgroundVideoAttributes}
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-[1240px] px-4 py-16 md:px-6 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
            <div className="space-y-10">
              <a href="#home" className="inline-flex items-center" aria-label="CoreCraft home">
                <Image
                  src="/Copy of CoreCraft Logo.png"
                  alt="CoreCraft logo"
                  width={220}
                  height={70}
                  className="h-16 w-auto invert"
                />
              </a>

              <div className="space-y-4">
                <h2 className="text-[52px] font-semibold leading-[1.05] tracking-tight" style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}>
                  Let’s <span className="italic font-light">Scale</span>
                  <br />
                  Your Brand.
                </h2>
                <p className="max-w-xl text-lg text-[#c2c2c2]">
                  Feel free to reach our if you want to collaborate with us, or simply have a chat
                </p>
              </div>

              <a
                href="https://mandala.framer.website/contact?utm_source=framer"
                className="group inline-flex items-center gap-4 rounded-[25px] border border-[#696969] px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:border-[#ff502e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff502e]/70"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10">Start a Project</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff502e] text-black transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </div>

            <div className="grid gap-12 text-base text-[#c2c2c2] sm:grid-cols-2">
              <div>
                <p className="mb-4 text-lg font-semibold text-white">Company</p>
                <ul className="space-y-2">
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="transition-colors duration-300 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 text-lg font-semibold text-white">Follow Us</p>
                <ul className="space-y-2">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="transition-colors duration-300 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 text-white/80 sm:flex-row sm:items-center sm:gap-10">
              <a
                href="tel:+1234456789"
                className="flex items-center gap-3 text-base transition-colors duration-300 hover:text-white"
              >
                <span className="h-3 w-3 rounded-full bg-[#ff502e]" />
                +1 234 456 789
              </a>
              <a
                href="mailto:hello@corecraft.com"
                className="flex items-center gap-3 text-base transition-colors duration-300 hover:text-white"
              >
                <span className="h-3 w-3 rounded-full bg-[#ff502e]" />
                hello@corecraft.com
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#c2c2c2]">
              <div className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80">
                <span>Made by</span>
                <Image 
                  src="/arclogo.png" 
                  alt="ARC AI Logo" 
                  width={80} 
                  height={32} 
                  className="h-8 w-auto"
                />
              </div>
              <span className="h-3 w-px bg-white/20" />
              <span className="transition-colors duration-300">
                Powered by Next.js
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="transition-colors duration-300">
                © 2025 corecraft®. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
