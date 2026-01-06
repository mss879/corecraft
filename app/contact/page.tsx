import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Libre_Caslon_Text } from 'next/font/google';

import { ContactFaq } from '@/components/contact/faq-section';
import { ContactForm } from '@/components/contact/contact-form';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';

const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Contact CoreCraft | Resume Writing & Career Services Sri Lanka',
  description:
    'Get in touch with CoreCraft for professional resume writing, ATS optimization, and digital services. Visit us in Colombo or contact us online for global career support.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'CoreCraft',
  image: 'https://www.corecraft.agency/corecraft-logo.png',
  '@id': 'https://www.corecraft.agency',
  url: 'https://www.corecraft.agency',
  telephone: '+94774927972',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '416/3, 10th Mile Post, Boralssgamuwa',
    addressLocality: 'Colombo',
    addressCountry: 'LK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 6.840,
    longitude: 79.898,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ],
    opens: '09:00',
    closes: '18:00',
  },
  priceRange: '$$',
  sameAs: [
    'https://www.linkedin.com/company/corecraft',
    // Add other social profiles here
  ],
};

type ContactDetail = {
  heading: string;
  body: ReactNode;
};

const contactDetails: ContactDetail[] = [
  {
    heading: 'Address',
    body: (
      <>
        416/3, 10th Mile Post, Boralssgamuwa
        <br />
        Colombo, Sri Lanka
      </>
    ),
  },
  {
    heading: 'Phone',
    body: (
      <>
        <a href="tel:+94774927972" className="transition-colors duration-300 hover:text-white">
          +94 77 492 7972
        </a>
        {' | '}
        <a href="tel:+94774466473" className="transition-colors duration-300 hover:text-white">
          +94 77 446 6473
        </a>
      </>
    ),
  },
  {
    heading: 'Office Hours',
    body: 'Monday - Friday • 9:00 AM – 6:00 PM',
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav logoHref="/" forceFloating />
      <main className="relative isolate overflow-hidden bg-black pb-24 pt-32 text-white sm:pt-40">
        <div className="mx-auto grid max-w-[1200px] gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-start xl:gap-24">
          <section className="space-y-14 lg:space-y-16">
            <header className="space-y-6">
              <h1 className={`${libreCaslon.className} text-4xl font-light tracking-tight text-white sm:text-5xl`}>
                Let&apos;s{' '}
                <span className="relative inline-block font-normal italic text-white">
                  <span className="absolute -bottom-1 left-0 h-3 w-full rounded-full bg-[#ff502e]" aria-hidden="true" />
                  <span className="relative">Collaborate</span>
                </span>{' '}
                And Grow
              </h1>
              <p className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
                Explore insights on marketing, branding, and social media to help your brand grow and stand out.
              </p>
            </header>

            <dl className="grid gap-8">
              {contactDetails.map((item) => (
                <div key={item.heading} className="space-y-2">
                  <dt className="text-base font-semibold text-white sm:text-lg">{item.heading}</dt>
                  <dd className="text-sm leading-relaxed text-white/75 sm:text-base">{item.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-[32px] border border-black/5 bg-white p-8 text-[#101010] shadow-[0px_26px_60px_-35px_rgba(15,15,15,0.25)] backdrop-blur-sm sm:p-10">
            <ContactForm />
          </section>
        </div>
      </main>
      <ContactFaq />
      <SiteFooter />
    </>
  );
}
