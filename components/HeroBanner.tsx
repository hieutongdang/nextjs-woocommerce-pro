'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

const SLIDE_IMAGES = [
  {
    src: '/mock/sl01.webp',
    alt: 'Coffee Promo',
  },
  {
    src: '/mock/sl02.jpg',
    alt: 'Juice Promo',
  },
  {
    src: '/mock/sl03.jpg',
    alt: 'Orange Promo',
  },
];

const SIDE_BANNERS = [
  {
    src: '/mock/banner1.jpg',
    alt: 'Juice',
  },
  {
    src: '/mock/banner2.jpg',
    alt: 'Orange',
  },
];

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Main Banner Slider */}
      <div className="lg:col-span-2 relative rounded-md overflow-hidden shadow-sm">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {SLIDE_IMAGES.map((slide, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                <div className="relative w-full">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
          onClick={scrollPrev}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
          onClick={scrollNext}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Side Banners */}
      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-col sm:gap-6">
        {SIDE_BANNERS.map((banner, index) => (
          <div key={index} className="relative rounded-md overflow-hidden shadow-sm">
            <div className="relative w-full">
              <Image
                src={banner.src}
                alt={banner.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 