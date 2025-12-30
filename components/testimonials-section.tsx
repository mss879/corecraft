import { ArrowUpRight, Quote, Star } from 'lucide-react';

const accent = '#ff502e';

const avatarImages = [
  'https://framerusercontent.com/images/5U7azVaVT6ogBk23qZv9AtdLy5c.png?scale-down-to=256',
  'https://framerusercontent.com/images/9o1cahhgEtzdulbyZpMfgf26Z5w.png?scale-down-to=256',
  'https://framerusercontent.com/images/My19q8uLsyh2zA7lcXTwPNtv5RM.jpg?scale-down-to=256',
  'https://framerusercontent.com/images/7dBgVlJGddtanMmE6mro8bfVO8.png?scale-down-to=256',
];

const testimonialCards = [
  {
    id: 'emma-collins',
    name: 'Emma Collins',
    role: 'CEO, Powersurge',
    quote:
      'CoreCraft transformed our brand identity and website beyond what we imagined. Their team was professional, creative, and delivered on time. Our online presence has never looked better.',
    avatar: 'https://framerusercontent.com/images/7dBgVlJGddtanMmE6mro8bfVO8.png?width=480&height=480',
    variant: 'dark' as const,
  },
  {
    id: 'michael-brooks',
    name: 'Michael Brooks',
    role: 'CTO, Warpspeed',
    quote:
      'CoreCraft revamped our online store with a sleek design that resonates with customers. Since launch, engagement and user experience have greatly improved.',
    avatar: 'https://framerusercontent.com/images/Qtiy6JZJ0E0ZUM1L1TfcKWvXjo.png?width=640&height=640',
    variant: 'accent' as const,
    stats: [
      { value: '+35%', label: 'Average order value' },
      { value: '+45%', label: 'User engagement' },
    ],
  },
  {
    id: 'liam-torres',
    name: 'Liam Torres',
    role: 'COO, CloudWatch',
    quote:
      'Our clean, intuitive website now showcases our SaaS platform perfectly, leading to increased sign-ups and higher customer satisfaction.',
    avatar: 'https://framerusercontent.com/images/VQjluMNywKhZ8T1UbafuyggOpg.png?width=640&height=640',
    variant: 'accent' as const,
    stats: [
      { value: '+54%', label: 'Sign-up rate' },
      { value: '+25', label: 'Client retention' },
    ],
  },
];

type TestimonialVariant = (typeof testimonialCards)[number]['variant'];

const performanceMetrics = [
  {
    id: 'metric-001',
    value: '4.6s',
  description: "Average page load time across all client websites we've deployed",
  },
  {
    id: 'metric-002',
    value: '18+',
  description: 'Countries where brands use websites built by CoreCraft',
  },
  {
    id: 'metric-003',
    value: '72%',
  description: 'Average improvement in conversion rates after a CoreCraft-led redesign',
  },
];

const StarRating = ({ variant }: { variant: TestimonialVariant }) => (
  <div className="flex items-center gap-1">
    <span className="sr-only">Rated 5 out of 5</span>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        aria-hidden="true"
        className={variant === 'accent' ? 'h-4 w-4 fill-white text-white' : 'h-4 w-4 fill-[#ff502e] text-[#ff502e]'}
      />
    ))}
  </div>
);

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-black py-24 text-white md:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
              <span className="h-1 w-8 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
              <span className="text-white">005</span>
              <span>Testimonials</span>
            </div>
            <div className="space-y-3">
              <h2
                className="text-[44px] font-semibold tracking-tight md:text-5xl lg:text-[56px]"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Client <span className="text-white/60">stories.</span>
              </h2>
              <p className="max-w-xl text-sm text-white/60 md:text-base lg:max-w-2xl">
                Hear directly from our clients about their experience with CoreCraft—from seamless collaboration to impactful design solutions that elevate their brands.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:items-end">
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatarImages.map((src, index) => (
                  <span
                    key={src}
                    className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/50 bg-black"
                    style={{ zIndex: avatarImages.length - index }}
                  >
                    <img src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
                  </span>
                ))}
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black text-sm font-semibold">
                  95+
                </span>
              </div>
            </div>
            <p className="max-w-[220px] text-sm text-white/60 md:max-w-xs">We&apos;ve successfully completed 95+ projects.</p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonialCards.map((card) => {
            const isAccent = card.variant === 'accent';
            return (
              <article
                key={card.id}
                className={
                  `flex h-full flex-col rounded-3xl border ${
                    isAccent ? 'border-transparent bg-[rgb(249,69,45)] text-black' : 'border-white/10 bg-[#121212] text-white'
                  } px-8 py-10 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-1 sm:px-10 sm:py-12`
                }
              >
                <div className="space-y-6">
                  {!isAccent && (
                    <Quote className="h-10 w-10 text-white/10" aria-hidden="true" />
                  )}
                  <StarRating variant={card.variant} />
                  <p className={isAccent ? 'text-base leading-relaxed text-black/80 md:text-lg' : 'text-base leading-relaxed text-white/80 md:text-lg'}>
                    {card.quote}
                  </p>
                </div>

                {/* Name, image, role, and stats removed as requested */}
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.2fr)]">
          {performanceMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#121212] px-8 py-10 sm:px-10"
            >
              <span className="text-5xl font-semibold leading-none md:text-6xl">{metric.value}</span>
              <p className="mt-6 text-sm text-white/60 md:text-base">{metric.description}</p>
            </div>
          ))}

          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#121212] px-8 py-10 sm:px-10">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                <span>CoreCraft</span>
                <span className="text-white/40">®</span>
              </div>
              <p className="text-base text-white/70">
                If you&apos;ve enjoyed working with us, we&apos;d love to hear from you — leave a review and help others discover CoreCraft.
              </p>
            </div>
            <a
              href="./contact"
              className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
            >
              Leave a review
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                style={{ backgroundColor: accent }}
              >
                <ArrowUpRight className="h-5 w-5 text-black" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
