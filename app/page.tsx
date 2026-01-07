import type { Metadata } from 'next';

import HomeClient from './page.client';

export const metadata: Metadata = {
  title: 'CoreCraft | Premium Design, Web Development & Career Services',
  description:
    "Sri Lanka's #1 Agency for ATS Resume Writing, LinkedIn Optimization, Web Design & Branding. Elevate your career & digital presence with CoreCraft.",
};

export default function HomePage() {
  return <HomeClient />;
}
