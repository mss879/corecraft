import type { Metadata } from 'next';

import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export const metadata: Metadata = {
  title: 'Page Not Found | CoreCraft',
  description: "The page you’re looking for doesn’t exist or has been moved. Return to CoreCraft home and continue browsing our services and resources.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav logoHref="/" forceFloating />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-8xl font-bold text-[#ff502e]">404</h1>
        <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Page Not Found</h2>
        <p className="mt-4 max-w-md text-gray-400">
          We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
        >
          Return Home
        </Link>
      </div>
      <SiteFooter logoHref="/" />
    </div>
  );
}
