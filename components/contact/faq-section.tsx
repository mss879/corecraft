'use client';

import { useEffect, useRef, useState } from 'react';
import { Libre_Caslon_Text } from 'next/font/google';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'] });

const faqItems = [
  {
    question: 'What services does your digital marketing agency offer?',
    answer:
      'We provide a full range of digital marketing services, including SEO, social media marketing, paid advertising (PPC), content marketing, email marketing, and branding strategy. Our goal is to help businesses grow their online presence and attract more customers.',
  },
  {
    question: 'Do you work with small businesses and startups?',
    answer:
      "Absolutely! We love working with small businesses and startups. Whether you're just launching or looking to scale, we create tailored marketing strategies that fit your budget and business goals.",
  },
  {
    question: 'Why should I choose your agency over others?',
    answer:
      "We don’t just deliver services—we craft strategies that drive real results. With a focus on creativity, data-driven decisions, and personalized solutions, we help brands stand out in a crowded market. Plus, we treat your success as our own!",
  },
  {
    question: 'What branding services do you offer?',
    answer:
      'We offer a full range of branding services, including logo design, brand identity development, messaging, brand strategy, and visual storytelling. Our goal is to create a strong, memorable brand that resonates with your audience.',
  },
  {
    question: 'Can you manage our social media?',
    answer:
      'Yes! We offer full social media management, including content creation, strategy development, scheduling, and engagement. We help grow your presence, connect with your audience, and turn followers into loyal customers.',
  },
];

export function ContactFaq() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section className="relative bg-[#f6f6f6] py-20 sm:py-28">
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
