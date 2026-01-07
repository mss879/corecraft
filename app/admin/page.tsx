import type { Metadata } from 'next';

import AdminLoginPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Admin Login | CoreCraft',
  description: 'Sign in to the CoreCraft admin workspace to manage inquiries, leads, and site operations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginPageClient />;
}
