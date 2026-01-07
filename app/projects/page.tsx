import type { Metadata } from 'next';

import ProjectsPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Projects | CoreCraft Success Stories & Case Studies',
  description:
    'Explore CoreCraft success stories across resume transformations, career wins, and digital branding projects built to deliver measurable results.',
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
