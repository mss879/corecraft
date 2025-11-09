const accent = '#ff502e';

type Stat = { label: string; value: string; suffix?: string };

const stats: Stat[] = [
  { label: 'Projects Completed', value: '67' },
  { label: 'Clients Served Worldwide', value: '43', suffix: '+' },
  { label: 'Design Awards & Recognitions', value: '12', suffix: '+' },
  { label: 'Campaigns Launched', value: '16', suffix: '+' },
] ;

const awardLogos = [
  {
    src: 'https://framerusercontent.com/images/4H6OUUuGouB2FI9oSSxRpzZ5jw.svg?width=164&height=42',
    alt: 'Creative Circle',
  },
  {
    src: 'https://framerusercontent.com/images/u6FOxNcWy0i3m1SHJW8Oi7bA4d4.svg?width=164&height=44',
    alt: 'Branding Summit',
  },
  {
    src: 'https://framerusercontent.com/images/9drsodJBdhGZdlOXuNZJ5iGL0.svg?width=48&height=35',
    alt: 'Design Week',
  },
  {
    src: 'https://framerusercontent.com/images/IhW4bkGIg2MqfgT6fnOwINEzmMQ.svg?width=192&height=32',
    alt: 'Minimal Awards',
  },
  {
    src: 'https://framerusercontent.com/images/SO6Z76CiNDVTliW0IZRTx5CfYu0.svg?width=194&height=29',
    alt: 'Pixels Conference',
  },
  {
    src: 'https://framerusercontent.com/images/kEbwQLq5YQtKEcKw7hoECU0I.svg?width=178&height=29',
    alt: 'Future Design',
  },
  {
    src: 'https://framerusercontent.com/images/z4g26VxyksdIRBPabWJ1JaZGvgU.svg?width=96&height=36',
    alt: 'UX Masters',
  },
] as const;

const marqueeLogos = [...awardLogos, ...awardLogos, ...awardLogos];

export function HeroHighlights() {
  return (
    <section className="relative bg-black py-16 text-white md:py-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-4 md:px-6">
        <div className="text-center text-sm uppercase tracking-[0.35em] text-white/50">Performance Snapshot</div>

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                `relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111] px-6 py-8 text-center shadow-[0_30px_120px_-80px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:-translate-y-1 lg:px-7 lg:py-10`
              }
            >
              <div className="text-xs uppercase tracking-[0.35em] text-white/30">{stat.label}</div>
              <div className="mt-5 flex items-center justify-center gap-1 text-5xl font-semibold leading-none text-white md:text-6xl">
                <span>{stat.value}</span>
                {stat.suffix ? <span className="text-3xl text-white/60 md:text-4xl">{stat.suffix}</span> : null}
              </div>
              {index === 0 && (
                <span
                  className="absolute inset-x-6 top-0 h-px"
                  style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0b0b0b] px-6 py-8 md:px-8"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
          }}
        >
          <div className="absolute -left-10 top-1/2 hidden h-24 w-24 -translate-y-1/2 rotate-[40deg] rounded-full bg-[radial-gradient(circle,rgba(255,80,46,0.35),rgba(255,80,46,0))] opacity-80 md:block" aria-hidden="true" />
          <div className="absolute -right-12 top-1/2 hidden h-20 w-20 -translate-y-1/2 rotate-45 rounded-full bg-[radial-gradient(circle,rgba(255,80,46,0.35),rgba(255,80,46,0))] opacity-80 md:block" aria-hidden="true" />

          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
            Award Ticker
          </div>

          <div className="mt-6 overflow-hidden">
            <div className="flex min-w-max gap-16 whitespace-nowrap animate-[heroTicker_26s_linear_infinite]">
              {marqueeLogos.map((logo, index) => (
                <div key={`${logo.alt}-${index}`} className="flex items-center justify-center">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 w-auto opacity-75 transition-opacity duration-300 hover:opacity-100 md:h-9"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
