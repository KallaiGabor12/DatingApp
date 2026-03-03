"use client"
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { ViewerContext } from "./GalleryDisplay";
import Pagination from "@/components/tables/Pagination";

const IMAGES_PER_PAGE = 12;

export default function GalleryDisplayAll() {
    const context = useContext(ViewerContext);
    const [currentPage, setCurrentPage] = useState(1);

    if (!context) return null;

    const { images, mode } = context;

    // Reset to page 1 when images change
    useEffect(() => {
        setCurrentPage(1);
    }, [images.length]);

    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const endIndex = startIndex + IMAGES_PER_PAGE;
    const currentImages = images.slice(startIndex, endIndex);

    if (images.length === 0) {
        return (
            <div className="text-center py-12" role="status" aria-live="polite">
                <p className="text-gray-600 text-lg">Nincsenek képek ebben a kategóriában.</p>
            </div>
        );
    }

    return (
        <div id="gallery-all-view" role="tabpanel" aria-labelledby="all-view-tab">
            <div 
                className="columns-1 sm:columns-2 lg:columns-3 gap-4 mb-6 w-full max-w-[min(1152px,90vw)] mx-auto"
                role="list"
                aria-label={`${images.length} kép galéria`}
                style={{ isolation: 'isolate' }}
            >
                {currentImages.map((img, index) => {
                    const globalIndex = startIndex + index;
                    return (
                        <button
                            key={img.id}
                            type="button"
                            role="listitem"
                            onClick={() => {
                                mode.set("carousel");
                                // Small delay to ensure carousel mounts, then navigate to image
                                setTimeout(() => {
                                    const swiperEl = document.querySelector('.swiper') as any;
                                    if (swiperEl && swiperEl.swiper) {
                                        swiperEl.swiper.slideTo(globalIndex, 0);
                                    }
                                }, 100);
                            }}
                            className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow mb-2 break-inside-avoid group focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2"
                            aria-label={`Kép megtekintése: ${img.title || img.alt || "Referencia kép"}`}
                        >
                            <Image
                                src={`/api/uploads/references/${img.filename}`}
                                alt={img.alt || img.title || "Referencia kép"}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                className="object-cover [overflow-clip-margin:unset] rounded-lg transition-all duration-300 group-hover:scale-110"
                                style={{
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    willChange: 'transform',
                                }}
                                loading={index < 4 ? "eager" : "lazy"}
                            />
                            
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-sm font-medium truncate" title={img.title}>
                                    {img.title}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-6" aria-label="Lapozás">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            // Scroll to top of gallery on page change
                            const galleryElement = document.getElementById("gallery-all-view");
                            if (galleryElement) {
                                galleryElement.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                        }}
                    />
                </div>
            )}

            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {currentPage === 1 
                    ? `1-${currentImages.length} kép megjelenítve ${images.length}-ből`
                    : `${startIndex + 1}-${Math.min(endIndex, images.length)} kép megjelenítve ${images.length}-ből`
                }
            </div>
        </div>
    );
}

