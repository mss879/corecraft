import type { ReactNode, SVGProps } from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type CompanyLink = {
  label: string;
  href: string;
};

export type LegalLink = {
  label: string;
  href: string;
};

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

export const primaryLinks: NavLink[] = [
  { label: 'ABOUT', href: '/about' },
  { label: 'PORTFOLIO', href: '/projects' },
  { label: 'CONTACT', href: '/contact' },
];

export const menuLinks: NavLink[] = [
  { label: 'HOME', href: '/' },
  { label: 'SERVICES', href: '/services' },
  { label: 'BLOG', href: '/blog' },
];

export const socialLinks: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/corecraftlk/',
    icon: <Instagram aria-hidden="true" focusable="false" />,
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=61585884321215',
    icon: <Facebook aria-hidden="true" focusable="false" />,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@CoreCraftAgency',
    icon: <Youtube aria-hidden="true" focusable="false" />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@corecraft.lk?_r=1&_t=ZS-92qlATtj26T',
    icon: <TikTokIcon aria-hidden="true" focusable="false" />,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: <Linkedin aria-hidden="true" focusable="false" />,
  },
  {
    label: 'X/Twitter',
    href: '#',
    icon: <Twitter aria-hidden="true" focusable="false" />,
  },
];

export const companyLinks: CompanyLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export const legalLinks: LegalLink[] = [
  { label: 'Privacy Policy', href: 'https://mandala.framer.website/legal/privacy-policy?utm_source=framer' },
  { label: 'Terms of Service', href: 'https://mandala.framer.website/legal/terms-of-service?utm_source=framer' },
];
