import { ArrowUpRight, MessageCircle, Rocket, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const accent = '#ff502e';

const projectShowcase = [
  {
    title: 'Lightspeed',
    image: 'https://framerusercontent.com/images/IRarxbe05jVfRyj4iohhfTL7yyw.jpg?width=800&height=1200',
    logo: 'https://framerusercontent.com/images/iCdXfJ0izW1KpXgoQEQ0NvYftT8.png?width=560&height=140',
    href: '/projects/lightspeed',
  },
  {
    title: 'Boltshift',
    image: 'https://framerusercontent.com/images/RFUk5RKy3RK5IfUg41QuoNVe5yU.png?width=960&height=1200',
    logo: 'https://framerusercontent.com/images/h7q7dQYmAqaBaGqpd0qLoHo4gNI.png?width=435&height=113',
    href: '/projects/boltshift',
  },
  {
    title: 'Powersurge',
    image: 'https://framerusercontent.com/images/PXx33vzzrqJEfSkxbGepmVc.png?width=904&height=1200',
    logo: 'https://framerusercontent.com/images/5lyYGJlj5d6TUcxbVcR18MbKyrM.png?width=569&height=140',
    href: '/projects/powersurge',
  },
  {
    title: 'Warpspeed',
    image: 'https://framerusercontent.com/images/SFl13TSgsG6w0EXrBe4xExe9fY.png?width=1200&height=673',
    logo: 'https://framerusercontent.com/images/P7gw4luWZlEvbn9wdWWpyOg4aw.png?width=587&height=140',
    href: '/projects/warpspeed',
  },
  {
    title: 'CloudWatch',
    image: 'https://framerusercontent.com/images/jktIgNrel0kMPLYCv1vB9AqA.png?width=904&height=1200',
    logo: 'https://framerusercontent.com/images/eLKqXl5yD92ucj8QL01psGKrOM.png?width=645&height=140',
    href: '/projects/cloudwatch',
  },
];

const projectShowcaseLoop = [...projectShowcase, ...projectShowcase];

const supportMessages = [
  { role: 'client', message: 'Can we update the layout before launch?' },
  { role: 'agency', message: 'Of course!' },
  { role: 'agency', message: "We’ll make the changes and send a quick preview." },
  {
    role: 'agency',
    message: 'Just updated. You should be able to see the new version on your side now.',
  },
  { role: 'client', message: 'Amazing, thank you! You guys are fast 🙌' },
];

const StarStripe = () => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className="h-4 w-4 fill-white text-white" aria-hidden="true" />
    ))}
    <span className="ml-2 text-sm font-medium text-black/80">4.9/5</span>
  </div>
);

const AccentHeading = () => (
  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
    <span className="h-1 w-8 rounded-full" style={{ background: accent }} />
    <span className="text-white">002</span>
    <span>Why choose us</span>
  </div>
);

export function WhyUsSection() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-black py-24 text-white md:py-28">
      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-16 px-4 md:px-6 lg:gap-20">
        <div className="flex flex-col gap-6">
          <AccentHeading />
          <div className="space-y-4">
            <h2 className="text-[44px] font-semibold tracking-tight text-white md:text-5xl lg:text-[56px]">
              <span className="text-white">Our </span>
              <span className="text-white/70">advantage.</span>
            </h2>
            <p className="max-w-[520px] text-base text-white/60 md:text-lg">
              Discover how our tailored design solutions, strategic thinking, and proven expertise can elevate your brand and set you apart.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black p-8 sm:p-10 lg:col-span-8">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://framerusercontent.com/images/Af7ZirUQtXr63lrfj584g9zgg.png?scale-down-to=2048"
                  alt="Decorative grid"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="pointer-events-none absolute -top-16 -right-6 hidden text-[200px] font-black leading-none text-white/5 md:block">
                08
              </span>

              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="max-w-xl space-y-4">
                  <h3 className="text-3xl font-semibold md:text-[36px]">8 years of experience</h3>
                  <p className="text-sm text-white/60 md:text-base">
                    Hundreds of successful projects across industries, built on{' '}
                    <span className="text-white">8 years of refined design and development practices.</span>
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex min-w-max gap-4 animate-[whyUsMarquee_28s_linear_infinite]" aria-hidden="true">
                    {projectShowcaseLoop.map((project, index) => (
                      <a
                        key={`${project.title}-${index}`}
                        href={project.href}
                        className="group relative flex w-[210px] shrink-0 flex-col gap-3"
                        aria-label={`View ${project.title}`}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white/5">
                          <img
                            src={project.image}
                            alt={`${project.title} project preview`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/40 opacity-0 transition duration-500 group-hover:opacity-100" />
                          <div className="pointer-events-none absolute inset-x-4 bottom-4">
                            <div className="flex h-9 items-center justify-center rounded-full bg-black/70 px-4 backdrop-blur">
                              <img
                                src={project.logo}
                                alt=""
                                className="h-5 w-auto object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                          <span>{project.title}</span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5">
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black lg:col-span-4">
              <div className="absolute inset-0">
                <img
                  src="https://framerusercontent.com/images/nd4x6nckd1Qe0ssLOPuTGKMlcM.png?width=904&height=1200"
                  alt="Smiling woman"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/90" />
              </div>
              <div className="relative flex h-full flex-col justify-between gap-6 p-8 sm:p-10">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
                  <span>Satisfaction rate</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
                </div>
                <div>
                  <div className="text-6xl font-semibold leading-tight sm:text-[70px]">95%</div>
                  <p className="mt-3 max-w-xs text-sm text-white/60">From 95+ client projects.</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                  <StarStripe />
                  <span className="text-sm text-white/70">Trusted by brands worldwide</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:auto-rows-[minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black lg:col-span-5">
              <div className="absolute inset-0">
                <img
                  src="https://framerusercontent.com/images/emO7fjYsuMdJfa6Guq0B426lpk.png"
                  alt="Client working on laptop"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(8,8,8,0),rgba(8,8,8,0.92))]" />
              </div>
              <div className="relative flex h-full flex-col justify-between gap-8 p-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                    <span style={{ color: accent }}>*</span> Plans start from $799 / month
                  </p>
                  <div className="max-w-[420px] space-y-3">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
                      Flexible pricing
                      <span className="h-1 w-6 rounded-full" style={{ background: accent }} />
                    </div>
                    <h3 className="text-5xl font-semibold uppercase leading-tight sm:text-[62px]">
                      Flexible
                      <br />
                      pricing
                    </h3>
                    <p className="text-sm text-white/70 md:text-base">
                      Pricing plans that adapt to your budget and scope.
                    </p>
                  </div>
                </div>
                <a
                  href="/#pricing"
                  className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
                >
                  Get started
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1"
                    style={{ background: accent }}
                  >
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-3 lg:h-full">
              <div className="flex h-full flex-1 flex-col justify-between rounded-3xl border border-white/10 bg-black p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                    <Sparkles className="h-6 w-6" style={{ color: accent }} aria-hidden="true" />
                  </span>
                  <span className="hidden h-px flex-1 bg-white/10 sm:block" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold md:text-2xl">Fast turnaround</h3>
                  <p className="text-sm text-white/60">Projects launched in as little as 2 weeks.</p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
                  <span className="h-1 w-8 rounded-full" style={{ background: accent }} />
                  <span>Speed</span>
                </div>
              </div>

              <div className="flex h-full flex-1 flex-col justify-between rounded-3xl border border-white/10 bg-black p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                    <Rocket className="h-6 w-6" style={{ color: accent }} aria-hidden="true" />
                  </span>
                  <span className="hidden h-px flex-1 bg-white/10 sm:block" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold md:text-2xl">Scalable design</h3>
                  <p className="text-sm text-white/60">Design systems that scale with your product.</p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
                  <span className="h-1 w-8 rounded-full" style={{ background: accent }} />
                  <span>Growth</span>
                </div>
              </div>
            </div>

            <div className="relative flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-black p-8 lg:col-span-4">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold md:text-[28px]">Real-time support</h3>
                <p className="text-sm text-white/60">
                  Our team is always just a message away — <span className="text-white">real humans, real answers.</span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {supportMessages.map((entry, index) => (
                  <div
                    key={index}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-[0_12px_40px_-20px_rgba(0,0,0,0.8)]',
                      entry.role === 'agency'
                        ? 'self-end bg-[#2563eb] text-white'
                        : 'self-start bg-white text-black'
                    )}
                  >
                    {entry.message}
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50">
                <MessageCircle className="h-5 w-5 text-white/70" aria-hidden="true" />
                Message
                <div className="ml-auto flex items-center gap-2 text-xs uppercase tracking-[0.35em]">
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
