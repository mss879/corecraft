import { ArrowRight } from 'lucide-react';
import { GetStartedModal } from '@/components/get-started-modal';

const accent = '#ff502e';

export function ResumeSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-white md:py-28 border-t border-white/10">
      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-16 px-4 md:px-6 lg:gap-20">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            <span className="h-1 w-8 rounded-full" style={{ background: accent }} />
            <span className="text-white">003</span>
            <span>Career Growth</span>
          </div>
          
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-[44px] font-semibold tracking-tight text-white md:text-5xl lg:text-[56px]">
                <span className="text-white">Resume & </span>
                <span className="text-white/70">LinkedIn.</span>
              </h2>
              <p className="max-w-[520px] text-base text-white/60 md:text-lg">
                Expert profile optimization and resume crafting that maximize visibility, expand your network, and present your value with clarity. We fine-tune messaging, narrative, and calls-to-action so opportunities find you first.
              </p>
            </div>

            <GetStartedModal>
              <button
                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[#ff502e]/30 bg-[#ff502e]/5 p-2 pr-8 backdrop-blur-xl transition-all duration-500 hover:border-[#ff502e]/60 hover:bg-[#ff502e]/10 hover:shadow-[0_0_60px_-12px_rgba(255,80,46,0.6)] hover:-translate-y-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]"
              >
                <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff502e] to-[#c43e23] shadow-[0_5px_15px_rgba(255,80,46,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_25px_rgba(255,80,46,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]">
                  <ArrowRight className="h-6 w-6 text-white drop-shadow-md transition-transform duration-500 group-hover:rotate-[-45deg]" />
                </div>
                <span className="font-bold text-white tracking-wide text-lg drop-shadow-sm">Get Started</span>
                
                {/* 3D Highlights */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff502e]/50 to-transparent opacity-70" />
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-black/80 to-transparent" />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/5" />
              </button>
            </GetStartedModal>
          </div>
        </div>
      </div>
    </section>
  );
}
