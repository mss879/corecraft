'use client';

import { useEffect, useRef, useState } from 'react';

export function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black py-20 md:py-32" ref={containerRef}>
      <div className="mx-auto max-w-[1000px] px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[40px] border border-white/20 bg-gradient-to-b from-white/20 to-white/5 p-2 backdrop-blur-2xl md:rounded-[60px] md:p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_50px_-10px_rgba(255,255,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.3)]">
          <div className="relative w-full overflow-hidden rounded-[28px] md:rounded-[40px]">
            {/* Desktop Video - 16:9 aspect ratio */}
            <div className="hidden md:block">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {isVisible && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/TJgX4GUxWRU?autoplay=1&loop=1&playlist=TJgX4GUxWRU&controls=1&modestbranding=1&rel=0"
                    title="Desktop Showcase Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
            
            {/* Mobile Video - 9:16 aspect ratio for shorts */}
            <div className="block md:hidden">
              <div className="relative w-full mx-auto max-w-md" style={{ paddingBottom: '177.78%' }}>
                {isVisible && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/SVejQcihUCM?autoplay=1&loop=1&playlist=SVejQcihUCM&controls=1&modestbranding=1&rel=0"
                    title="Mobile Showcase Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
