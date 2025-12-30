'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import StaggeredMenu from '@/components/staggered-menu';
import { menuLinks, primaryLinks, socialLinks } from '@/lib/site-data';

const navLinkClasses = 'text-lg font-extrabold tracking-[0.2em] text-black transition-colors duration-300 hover:text-gray-700';

const MENU_COLORS = ['#1b1818', '#221d1d', '#282222', '#2f2626'];
const MENU_ACCENT = '#ff502e';

type SiteNavProps = {
  logoHref?: string;
  forceFloating?: boolean;
};

export function SiteNav({ logoHref = '/', forceFloating = false }: SiteNavProps) {
  const staggeredMenuItems = [...menuLinks, ...primaryLinks].map((link) => ({
    label: link.label,
    ariaLabel: `Navigate to ${link.label.toLowerCase()} section`,
    link: link.href,
  }));

  const staggeredSocialItems = socialLinks.map((link) => ({
    label: link.label,
    link: link.href,
    icon: link.icon,
  }));

  const [isNavFloating, setIsNavFloating] = useState(forceFloating);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, []);

  useEffect(() => {
    if (forceFloating) {
      setIsNavFloating(true);
      return () => {
        document.documentElement.classList.remove('overflow-hidden');
      };
    }

    const handleScroll = () => {
      setIsNavFloating(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [forceFloating]);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-40 w-full transition-all duration-500',
        isNavFloating ? 'px-4 pt-4' : 'bg-transparent',
        'transition-opacity duration-300',
        hasMounted ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="relative w-full">
        <div
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 z-0 h-[74px] w-full max-w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-[36px] border border-black/5 bg-white shadow-[0_28px_70px_-48px_rgba(0,0,0,0.65)] transition-all duration-500',
            isNavFloating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        />
        <div
          className={cn(
            'relative z-10 flex w-full items-center justify-center transition-all duration-500 md:justify-between',
            isNavFloating
              ? 'mx-auto h-[74px] max-w-[95%] px-4 md:px-8'
              : 'h-20 px-4 pt-8 md:px-6 lg:h-24'
          )}
        >
          <a
            href={logoHref}
            className={cn(
              'flex items-center',
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0',
              isNavFloating ? 'md:mr-0' : ''
            )}
          >
            <Image
              src="/Copy of CoreCraft Logo.png"
              alt="CoreCraft logo"
              width={220}
              height={70}
              className={cn(
                'w-auto transition-all duration-300',
                isNavFloating ? 'h-10 sm:h-12 md:h-[64px]' : 'h-10 sm:h-12 md:h-16 lg:h-[82px]'
              )}
              priority
            />
          </a>

          <div className="hidden items-center space-x-16 transition-all duration-300 md:flex">
            {primaryLinks.map((link) => (
              <a key={link.label} className={navLinkClasses} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div
            className={cn(
              'relative transition-all duration-300',
              'absolute right-4 top-1/2 -translate-y-1/2 md:static md:translate-y-0',
              'w-[58px] md:w-[150px]',
              isNavFloating ? 'h-[58px] md:h-[70px]' : 'h-[58px] md:h-20'
            )}
          >
            <StaggeredMenu
              key={isNavFloating ? 'floating-menu' : 'default-menu'}
              className="h-full w-full"
              items={staggeredMenuItems}
              socialItems={staggeredSocialItems}
              position="right"
              colors={MENU_COLORS}
              accentColor={MENU_ACCENT}
              menuButtonColor={isNavFloating ? '#101010' : '#100e0e'}
              openMenuButtonColor={MENU_ACCENT}
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
  );
}
