import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { CareerFormContainer } from '@/components/career-form-container';

export const metadata = {
  title: 'Start Your Career Journey | CoreCraft',
  description: 'Begin your career optimization with CoreCraft. Fill out our intake form to get started with resume writing and LinkedIn optimization.',
};

export default function StartCareerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-[#ff502e] selection:text-white">
      <SiteNav />
      <main className="flex-1 py-32">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-12 space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Start Your <span className="text-[#ff502e]">Career Journey</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/60 md:text-xl">
              Tell us about your goals and experience. We'll help you craft a narrative that opens doors to new opportunities.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl md:p-10">
            <CareerFormContainer className="space-y-8" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
