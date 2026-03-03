"use client"
import { useContext, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, A11y, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ViewerContext } from "./GalleryDisplay";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function GalleryCarousel() {
    const context = useContext(ViewerContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const [announcement, setAnnouncement] = useState("");
    const swiperRef = useRef<SwiperType | null>(null);

    if (!context) return null;

    const { images } = context;

    const handleSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.activeIndex);
        const image = images[swiper.activeIndex];
        if (image) {
            setAnnouncement(`Kép ${swiper.activeIndex + 1} a ${images.length}-ből: ${image.title || "Referencia kép"}`);
        }
        
        // Preload adjacent images
        const prevIndex = swiper.activeIndex - 1;
        const nextIndex = swiper.activeIndex + 1;
        
        if (prevIndex >= 0 && images[prevIndex]) {
            const img = new window.Image();
            img.src = `/api/uploads/references/${images[prevIndex].filename}`;
        }
        
        if (nextIndex < images.length && images[nextIndex]) {
            const img = new window.Image();
            img.src = `/api/uploads/references/${images[nextIndex].filename}`;
        }
    };

    // Add ARIA labels to pagination bullets for accessibility
    useEffect(() => {
        const updateBulletLabels = () => {
            const bullets = document.querySelectorAll('.gallery-carousel .gallery-bullet');
            bullets.forEach((bullet, index) => {
                if (bullet instanceof HTMLElement) {
                    bullet.setAttribute('aria-label', `Ugrás a kép ${index + 1}-hez`);
                    bullet.setAttribute('role', 'button');
                    bullet.setAttribute('tabIndex', '0');
                }
            });
        };

        updateBulletLabels();
        const interval = setInterval(updateBulletLabels, 500);

        return () => clearInterval(interval);
    }, [images.length, activeIndex]);

    if (images.length === 0) {
        return (
            <div className="text-center py-12" role="status" aria-live="polite">
                <p className="text-gray-600 text-lg">Nincsenek képek ebben a kategóriában.</p>
            </div>
        );
    }

    return (
        <div id="gallery-carousel-view" role="tabpanel" aria-labelledby="carousel-view-tab" className="relative w-11/12 mx-auto overflow-visible">
            {/* Live region for screen reader announcements */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {announcement}
            </div>

            {/* Carousel Container */}
            <div className="relative w-full mx-auto max-w-5xl">
                <Swiper
                    modules={[Pagination, Keyboard, A11y, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    watchSlidesProgress={true}
                    pagination={{
                        clickable: true,
                        bulletClass: "swiper-pagination-bullet gallery-bullet",
                        bulletActiveClass: "swiper-pagination-bullet-active gallery-bullet-active",
                    }}
                    keyboard={{
                        enabled: true,
                        onlyInViewport: true,
                    }}
                    a11y={{
                        enabled: true,
                        prevSlideMessage: "Előző kép",
                        nextSlideMessage: "Következő kép",
                        firstSlideMessage: "Ez az első kép",
                        lastSlideMessage: "Ez az utolsó kép",
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={handleSlideChange}
                    className="gallery-carousel"
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
                    {images.map((img, index) => (
                        <SwiperSlide key={img.id}>
                            <article
                                aria-label={`Kép ${index + 1} a ${images.length}-ből: ${img.title || "Referencia kép"}`}
                                className="w-full"
                            >
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={`/api/uploads/references/${img.filename}`}
                                        alt={img.alt || img.title || "Referencia kép"}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 1280px"
                                        className="object-cover [overflow-clip-margin:unset]"
                                        priority={index === 0}
                                        loading={index <= 2 ? "eager" : "lazy"}
                                    />
                                    {(img.title || img.alt) && (
                                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4">
                                            <h3 className="text-white text-lg font-semibold">{img.title}</h3>
                                        </div>
                                    )}
                                </div>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="absolute left-0 bottom-0 translate-y-2 md:top-[calc(50%-20px)] md:-translate-y-1/2 sm:-translate-x-full md:-translate-x-[115%] lg:-translate-x-[160%] z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-main text-white flex items-center justify-center shadow-md hover:bg-[#1F6A8F] focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={activeIndex === 0 ? "Előző kép (nem elérhető)" : "Előző kép"}
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
                            className="absolute right-0 bottom-0 translate-y-2 md:top-[calc(50%-20px)] md:-translate-y-1/2 sm:translate-x-full md:translate-x-[115%] lg:translate-x-[160%] z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-main text-white flex items-center justify-center shadow-md hover:bg-[#1F6A8F] focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={activeIndex === images.length - 1 ? "Következő kép (nem elérhető)" : "Következő kép"}
                            aria-disabled={activeIndex === images.length - 1}
                            disabled={activeIndex === images.length - 1}
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation Row */}
            {images.length > 1 && (
                <div className="mt-0 max-h-max px-4 max-w-4xl mx-auto pt-6 overflow-visible">
                    <div 
                        className="flex gap-3 max-w-3xl mx-auto pb-4 gallery-thumbnails"
                        role="list"
                        aria-label="Kép miniatűrök"
                        style={{ 
                            overflowX: 'auto',
                            overflowY: 'visible',
                            paddingTop: '0.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {images.map((img, index) => {
                            const isActive = index === activeIndex;
                            const isAdjacent = index === activeIndex - 1 || index === activeIndex + 1;
                            
                            return (
                                <div
                                    key={img.id}
                                    className={`shrink-0 ${isActive ? 'pt-2 -mt-2' : ''}`}
                                >
                                    <button
                                        type="button"
                                        role="listitem"
                                        onClick={() => swiperRef.current?.slideTo(index)}
                                        className={`relative aspect-video w-24 md:w-32 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 ${
                                            isActive 
                                                ? "border-main shadow-lg scale-105 z-10" 
                                                : "border-gray-300 hover:border-main/50 hover:shadow-md"
                                        }`}
                                    aria-label={`Ugrás a kép ${index + 1}-hez: ${img.title || "Referencia kép"}`}
                                    aria-current={isActive ? "true" : "false"}
                                >
                                    <Image
                                        src={`/api/uploads/references/${img.filename}`}
                                        alt={img.alt || img.title || "Referencia kép"}
                                        fill
                                        sizes="128px"
                                        className="object-cover [overflow-clip-margin:unset]"
                                        loading={isActive || isAdjacent ? "eager" : "lazy"}
                                    />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-main/20" />
                                    )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style jsx global>{`
                .gallery-carousel .swiper-pagination {
                    position: relative;
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                }

                .gallery-carousel .gallery-bullet {
                    width: 0.5rem;
                    height: 0.5rem;
                    background-color: white;
                    border: 1px solid #000a;
                    border-radius: 50%;
                    opacity: 1;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                }

                .gallery-carousel .gallery-bullet::before {
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

                .gallery-carousel .gallery-bullet-active {
                    width: 1.5rem;
                    background-color: #2C8CBE;
                    border-color: #2C8CBE;
                    border-radius: 0.75rem;
                }

                .gallery-carousel .swiper-button-disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Hide default Swiper navigation buttons */
                .gallery-carousel .swiper-button-next,
                .gallery-carousel .swiper-button-prev {
                    display: none;
                }

                /* Thumbnail navigation styles */
                .gallery-thumbnails {
                    scrollbar-width: thin;
                    scrollbar-color: #2C8CBE #e5e7eb;
                }

                .gallery-thumbnails::-webkit-scrollbar {
                    height: 8px;
                }

                .gallery-thumbnails::-webkit-scrollbar-track {
                    background: #e5e7eb;
                    border-radius: 4px;
                }

                .gallery-thumbnails::-webkit-scrollbar-thumb {
                    background-color: #2C8CBE;
                    border-radius: 4px;
                }

                .gallery-thumbnails::-webkit-scrollbar-thumb:hover {
                    background-color: #1F6A8F;
                }
            `}</style>
        </div>
    );
}

