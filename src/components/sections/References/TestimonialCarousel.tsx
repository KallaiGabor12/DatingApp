"use client";
import { Testimonial } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import TestimonialCard from "@/components/common/TestimonialCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface TestimonialCarouselProps {
    t: Omit<Testimonial, "id">[];
}

export default function TestimonialCarousel({ t }: TestimonialCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [announcement, setAnnouncement] = useState("");
    const swiperRef = useRef<SwiperType | null>(null);

    const handleSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.activeIndex);
        const testimonial = t[swiper.activeIndex];
        const name = testimonial?.name || "Névtelen";
        setAnnouncement(`Vélemény ${swiper.activeIndex + 1} a ${t.length}-ből: ${name}`);
    };

    // Add ARIA labels to pagination bullets for accessibility
    useEffect(() => {
        const updateBulletLabels = () => {
            const bullets = document.querySelectorAll('.testimonial-carousel .testimonial-bullet');
            bullets.forEach((bullet, index) => {
                if (bullet instanceof HTMLElement) {
                    bullet.setAttribute('aria-label', `Ugrás a vélemény ${index + 1}-hez`);
                    bullet.setAttribute('role', 'button');
                    bullet.setAttribute('tabIndex', '0');
                }
            });
        };

        // Update on mount and after slides change
        updateBulletLabels();
        const interval = setInterval(updateBulletLabels, 500);

        return () => clearInterval(interval);
    }, [t.length, activeIndex]);

    if (!t || t.length === 0) {
        return <>
            <h2 className="font-bold md:text-tablet-h2 text-main text-center mt-0 text-mobile-h2">Olvassa el, mások miért választottak minket</h2>
            <p className="text-default text-mobile-h2 text-center my-5 pb-20">Nincs bejegyzett vélemény</p>
        </>
    }

    return (
        <section
            className="w-full pb-8 md:pb-12 px-3 mx-auto"
            aria-labelledby="testimonial-heading"
        >
            <div className="mx-auto">
                {/* Header */}
                <header className="mb-6 md:mb-8 text-center md:text-left">
                    <h3 id="testimonial-heading" className="font-bold md:text-tablet-h2 text-center text-main mt-0 text-mobile-h2">Olvassa el, mások miért választottak minket</h3>
                </header>

                {/* Live region for screen reader announcements */}
                <div
                    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={announcement || undefined}
                >
                    {announcement}
                </div>

                {/* Carousel Container */}
                <div className="relative w-full mx-auto max-w-2xl">
                    <Swiper
                        modules={[Pagination, Keyboard, A11y]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            bulletClass: "swiper-pagination-bullet testimonial-bullet",
                            bulletActiveClass: "swiper-pagination-bullet-active testimonial-bullet-active",
                        }}
                        keyboard={{
                            enabled: true,
                            onlyInViewport: true,
                        }}
                        a11y={{
                            enabled: true,
                            prevSlideMessage: "Előző vélemény",
                            nextSlideMessage: "Következő vélemény",
                            firstSlideMessage: "Ez az első vélemény",
                            lastSlideMessage: "Ez az utolsó vélemény",
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={handleSlideChange}
                        className="testimonial-carousel"
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 1,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {t.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <article
                                    aria-label={`Vélemény ${index + 1} a ${t.length}-ből`}
                                    className="w-full"
                                >
                                    <TestimonialCard
                                        record={{
                                            ...testimonial,
                                            id: index, // Temporary id for carousel use
                                        }}
                                        carouselMode={true}
                                        forceExpanded={true}
                                        defaultExpanded={true}
                                        className="w-full"
                                    />
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <button
                        type="button"
                        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 -translate-x-8/12 sm:-translate-x-11/12 md:-translate-x-[115%] lg:-translate-x-[160%] z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-main text-white flex items-center justify-center shadow-md hover:bg-[#1F6A8F] focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={activeIndex === 0 ? "Előző vélemény (nem elérhető)" : "Előző vélemény"}
                        aria-disabled={activeIndex === 0}
                        disabled={activeIndex === 0}
                        onClick={() => swiperRef.current?.slidePrev()}
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 translate-x-8/12 sm:translate-x-11/12 md:translate-x-[115%] lg:translate-x-[160%] z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-main text-white flex items-center justify-center shadow-md hover:bg-[#1F6A8F] focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={activeIndex === t.length - 1 ? "Következő vélemény (nem elérhető)" : "Következő vélemény"}
                        aria-disabled={activeIndex === t.length - 1}
                        disabled={activeIndex === t.length - 1}
                        onClick={() => swiperRef.current?.slideNext()}
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <style jsx global>{`
        .testimonial-carousel .swiper-pagination {
          position: relative;
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .testimonial-carousel .testimonial-bullet {
          width: 0.5rem;
          height: 0.5rem;
          background-color: white;
          border: 1px solid #000a;
          border-radius: 50%;
          opacity: 1;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .testimonial-carousel .testimonial-bullet::before {
          content: '';
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .testimonial-carousel .testimonial-bullet-active {
          width: 1.5rem;
          background-color: #FF6B35;
          border-color: #FF6B35;
          border-radius: 0.75rem;
        }

        .testimonial-carousel .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Hide default Swiper navigation buttons */
        .testimonial-carousel .swiper-button-next,
        .testimonial-carousel .swiper-button-prev {
          display: none;
        }
      `}</style>
        </section>
    );
}
