'use client';

import { useEffect, useRef } from 'react';

export function VideoShowcase() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play videos when in view
            const playVideo = async (video: HTMLVideoElement | null) => {
              if (video) {
                try {
                  video.muted = true;
                  await video.play();
                } catch (err) {
                  console.log('Video play failed:', err);
                }
              }
            };
            playVideo(desktopVideoRef.current);
            playVideo(mobileVideoRef.current);
          } else {
            // Pause videos when out of view
            desktopVideoRef.current?.pause();
            mobileVideoRef.current?.pause();
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the container is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black py-20 md:py-32">
      <div className="mx-auto max-w-[1000px] px-4 md:px-6">
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-[40px] border border-white/20 bg-gradient-to-b from-white/20 to-white/5 p-2 backdrop-blur-2xl md:rounded-[60px] md:p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_50px_-10px_rgba(255,255,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.3)]"
        >
          <div className="relative w-full overflow-hidden rounded-[28px] md:rounded-[40px]">
            {/* Desktop Video */}
            <video
              ref={desktopVideoRef}
              loop
              muted
              playsInline
              preload="auto"
              className="hidden h-full w-full object-cover md:block"
            >
              <source src="/video for desktop.mp4" type="video/mp4" />
            </video>
            
            {/* Mobile Video */}
            <video
              ref={mobileVideoRef}
              loop
              muted
              playsInline
              preload="auto"
              className="block h-full w-full object-cover md:hidden"
            >
              <source src="/video for mobile.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
