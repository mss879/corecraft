import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Libre_Caslon_Text } from 'next/font/google';

import { ContactFaq } from '@/components/contact/faq-section';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Contact CoreCraft | Collaborate With Our Team',
  description:
    'Get in touch with the CoreCraft team to discuss your next project. Share your vision, ask a question, or request a custom proposal today.',
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
        123 Market Street, Suite 400
        <br />
        Los Angeles, CA 90001
      </>
    ),
  },
  {
    heading: 'Phone',
    body: (
      <a href="tel:+1234456789" className="transition-colors duration-300 hover:text-white">
        +1 234 456 789
      </a>
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
            <form className="space-y-6" action="#" method="post">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
                    Your name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="h-14 rounded-xl border-[#ececec] bg-[#fafafa] text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
                    Company name
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="Enter company name"
                    className="h-14 rounded-xl border-[#ececec] bg-[#fafafa] text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter email address"
                  className="h-14 rounded-xl border-[#ececec] bg-[#fafafa] text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us about your vision"
                  className="min-h-[180px] rounded-2xl border-[#ececec] bg-[#fafafa] pb-4 pt-3 text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
                />
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-[#7a7a7a]">
                  By submitting this form you agree to our{' '}
                  <a
                    href="https://mandala.framer.website/legal/terms-of-service?utm_source=framer"
                    className="font-medium text-black underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://mandala.framer.website/legal/privacy-policy?utm_source=framer"
                    className="font-medium text-black underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </p>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#dcdcdc] px-7 py-3 text-base font-semibold text-black transition-colors duration-300 hover:border-[#ff502e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff502e]/70"
                >
                  Submit
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff502e] text-black transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <ContactFaq />
      <SiteFooter />
    </>
  );
}
