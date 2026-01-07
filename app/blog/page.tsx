import type { Metadata } from 'next';

import BlogPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Blog | Career Insights, Resume Tips & Digital Strategy - CoreCraft',
  description:
    'Read CoreCraft articles on resume writing, ATS optimization, LinkedIn growth, career strategy, and digital innovation for professionals and brands.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
