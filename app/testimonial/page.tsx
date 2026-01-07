import type { Metadata } from 'next';

import TestimonialSubmitPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Submit Testimonial | CoreCraft',
  description: 'Share your experience with CoreCraft.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestimonialSubmitPage() {
  return <TestimonialSubmitPageClient />;
}
