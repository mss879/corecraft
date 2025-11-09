import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CoreCraft - Premium Design & Development Agency | Web Design Experts',
  description: 'CoreCraft is a leading design and development agency with 8 years of experience. We craft exceptional digital experiences, custom web solutions, and brand identities that elevate your business.',
  keywords: [
    'web design agency',
    'web development',
    'digital design',
    'brand identity',
    'UI UX design',
    'custom web solutions',
    'creative agency',
    'design studio',
    'CoreCraft',
    'web development services',
    'responsive web design',
    'digital experiences',
  ],
  authors: [{ name: 'CoreCraft Team' }],
  creator: 'CoreCraft',
  publisher: 'CoreCraft',
  metadataBase: new URL('https://corecraft.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CoreCraft - Premium Design & Development Agency',
    description: 'Crafting exceptional digital experiences with 8 years of expertise. Custom web solutions, brand identities, and strategic design that sets you apart.',
    siteName: 'CoreCraft',
    images: [
      {
        url: '/Copy of CoreCraft Logo.png',
        width: 1200,
        height: 630,
        alt: 'CoreCraft - Design & Development Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoreCraft - Premium Design & Development Agency',
    description: 'Crafting exceptional digital experiences with 8 years of expertise in web design and development.',
    creator: '@VeloxThemes',
    images: ['/Copy of CoreCraft Logo.png'],
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
  category: 'technology',
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
              url: 'https://corecraft.com',
              logo: 'https://corecraft.com/Copy of CoreCraft Logo.png',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
