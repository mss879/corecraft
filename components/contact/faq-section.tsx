'use client';

import { useEffect, useRef, useState } from 'react';
import { Libre_Caslon_Text } from 'next/font/google';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'] });

const faqItems = [
  {
    question: 'How much does professional resume writing cost in Sri Lanka?',
    answer:
      'Our resume writing packages are competitively priced for the Sri Lankan market, starting from basic refresh-ups to comprehensive executive packages. We offer customized quotes based on your career level (Entry, Mid, Senior/Executive) to ensure you get the best value.',
  },
  {
    question: 'Is your resume writing service ATS friendly?',
    answer:
      'Yes, absolutely. We specialize in creating ATS (Applicant Tracking System) optimized resumes. We use compatible formatting, relevant keywords, and standard section headers to ensure your CV passes automated screening tools used by recruiters globally.',
  },
  {
    question: 'Do you help with LinkedIn profile optimization?',
    answer:
      'Yes! We offer full LinkedIn profile makeovers. This includes writing a compelling headline, an engaging "About" summary, optimizing your skills section for SEO, and providing guidance on professional networking to boost your visibility to recruiters.',
  },
  {
    question: 'Can you help me apply for jobs overseas (UK, Australia, Dubai)?',
    answer:
      'Definately. We have experience crafting CVs that meet international standards (including UK, Australian, and Middle Eastern formats). We understand the nuances of global job markets and tailor your application to appeal to international employers.',
  },
  {
    question: 'How long does it take to get my new CV?',
    answer:
      'Typically, our standard turnaround time is 3-5 business days after we receive all your information. We also offer express services if you have an urgent deadline. We believe in quality over speed to ensure your document is perfect.',
  },
];

export function ContactFaq() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

// Add JSON-LD script to the return
  return (
    <section className="relative bg-[#f6f6f6] py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        ref={containerRef}
        className={cn(
          'mx-auto flex max-w-4xl flex-col gap-12 px-4 transition-all duration-1000 ease-out md:px-6',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="text-center">
          <h2 className={cn(libreCaslon.className, 'text-4xl font-light tracking-tight text-[#101010] sm:text-[44px]')}>
            Questions?{' '}
            <span className="relative inline-block font-normal italic text-[#191919]">
              <span className="absolute bottom-[0.4rem] left-0 h-3 w-full rounded-full bg-[#ff502e]" aria-hidden="true" />
              <span className="relative">Answered</span>
            </span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-0">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className={cn(
                'border-[#d5d5d5]',
                index === 0 ? 'border-t border-b' : 'border-b'
              )}
            >
              <AccordionItem value={`faq-${index}`} className="border-none">
                <AccordionTrigger className="group flex w-full items-center justify-between gap-6 px-0 py-6 text-left text-lg font-normal leading-snug text-[#101010] tracking-tight hover:no-underline focus:outline-none focus-visible:ring-0 sm:text-xl [&>svg]:hidden">
                  <span className="pr-6 text-left leading-relaxed">
                    {item.question}
                  </span>
                  <span className="relative flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center">
                    <span className="h-[2px] w-full rounded-full bg-[#121212] transition-colors duration-300" />
                    <span className="absolute h-full w-[2px] rounded-full bg-[#121212] transition-transform duration-300 group-data-[state=open]:scale-y-0" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-0 text-base leading-relaxed text-[#575757] sm:text-lg">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
