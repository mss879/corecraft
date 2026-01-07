import type { Metadata } from 'next';

import AdminDashboardClient from './page.client';

export const metadata: Metadata = {
  title: 'Admin Dashboard | CoreCraft',
  description: 'CoreCraft internal dashboard for managing inquiries, leads, content, careers, and projects.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
