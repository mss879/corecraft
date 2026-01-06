import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { companyLinks, socialLinks } from '@/lib/site-data';

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

export function SiteFooter({ logoHref = '/' }: { logoHref?: string }) {
  return (
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
            <Link href={logoHref} className="inline-flex items-center" aria-label="CoreCraft home">
              <Image
                src="/corecraft-logo.png"
                alt="CoreCraft logo"
                width={220}
                height={70}
                className="h-16 w-auto invert"
              />
            </Link>

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

            <Link
              href="/contact"
              className="group inline-flex items-center gap-4 rounded-[25px] border border-[#696969] px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:border-[#ff502e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff502e]/70"
            >
              <span className="relative z-10">Start a Project</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff502e] text-black transition-transform duration-300 group-hover:translate-x-1">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          </div>

          <div className="grid gap-12 text-base text-[#c2c2c2] sm:grid-cols-2">
            <div>
              <p className="mb-4 text-lg font-semibold text-white">Company</p>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('/') ? (
                      <Link
                        href={link.href}
                        className="transition-colors duration-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="transition-colors duration-300 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href="/admin"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Admin
                  </Link>
                </li>
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
                      target={link.href === '#' ? undefined : '_blank'}
                      rel={link.href === '#' ? undefined : 'noopener noreferrer'}
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
              href="tel:+94774927972"
              className="flex items-center gap-3 text-base transition-colors duration-300 hover:text-white"
            >
              <span className="h-3 w-3 rounded-full bg-[#ff502e]" />
              +94 77 492 7972 | +94 77 446 6473
            </a>
            <a
              href="mailto:info@corecraft.agency"
              className="flex items-center gap-3 text-base transition-colors duration-300 hover:text-white"
            >
              <span className="h-3 w-3 rounded-full bg-[#ff502e]" />
              info@corecraft.agency
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#c2c2c2]">
            <a 
              href="https://www.arcai.agency" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80"
            >
              <span>Made by</span>
              <Image
                src="/arclogo.png"
                alt="ARC AI Logo"
                width={80}
                height={32}
                className="h-8 w-auto"
              />
            </a>
            <span className="h-3 w-px bg-white/20" />
            <span className="transition-colors duration-300">Powered by Next.js</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="transition-colors duration-300">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> corecraft®. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
