import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resume & ATS Career Services in Sri Lanka | CoreCraft',
  description: 'CoreCraft is the #1 Resume & ATS Career Services agency in Sri Lanka. We specialize in professional CV writing, LinkedIn profile optimization, and career coaching to elevate your professional journey. Also offering premium digital services including branding, web development, and SEO.',
  keywords: [
    'resume creation Sri Lanka',
    'CV making Sri Lanka',
    'resume making service',
    'ATS resume writing',
    'ATS friendly CV',
    'LinkedIn profile optimization',
    'Sri Lanka CV making company',
    'professional resume writer Sri Lanka',
    'career services Sri Lanka',
    'resume writing Colombo',
    'CV writing service',
    'branding agency Sri Lanka',
    'web development Sri Lanka',
    'digital marketing agency Sri Lanka',
    'CoreCraft'
  ],
  authors: [{ name: 'CoreCraft Team' }],
  creator: 'CoreCraft',
  publisher: 'CoreCraft',
  metadataBase: new URL('https://www.corecraft.agency'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CoreCraft - #1 Resume & ATS Career Services in Sri Lanka',
    description: 'Elevate your career with Sri Lanka\'s top professional resume writers. We craft ATS-friendly CVs and optimize LinkedIn profiles for local and global opportunities.',
    siteName: 'CoreCraft',
    images: [
      {
        url: '/corecraft-logo.png',
        width: 1200,
        height: 630,
        alt: 'CoreCraft - Resume & Career Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoreCraft - #1 Resume & ATS Career Services in Sri Lanka',
    description: 'Expert CV writing and LinkedIn optimization services in Sri Lanka. Build your professional brand with CoreCraft.',
    creator: '@VeloxThemes',
    images: ['/corecraft-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/corecraftfavicon.png' },
      { url: '/corecraftfavicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/corecraftfavicon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/corecraftfavicon.png',
    apple: '/corecraftfavicon.png',
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'career',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Stack+Sans+Notch:wght@200..700&display=swap" rel="stylesheet" />
        
        {/* Additional SEO meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CoreCraft',
              url: 'https://www.corecraft.agency',
              logo: 'https://www.corecraft.agency/corecraft-logo.png',
              description: 'Premium design and development agency crafting exceptional digital experiences',
              sameAs: [
                'https://www.linkedin.com/company/velox-themes/',
                'https://x.com/VeloxThemes',
                'https://instagram.com',
                'https://facebook.com',
                'https://www.tiktok.com/@corecraft',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: 'English',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
