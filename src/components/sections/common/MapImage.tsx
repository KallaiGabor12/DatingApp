"use client";

import { useState, useEffect } from "react";

export default function MapImage({ alt, className }: { alt: string; className?: string }) {
    const [currentSrc, setCurrentSrc] = useState<string>("/location/location_sma.png");
    const [hasTriedFallback, setHasTriedFallback] = useState(false);

    useEffect(() => {
        // Determine initial source based on screen size
        const updateSrc = () => {
            if (window.innerWidth >= 1024) {
                setCurrentSrc("/location/location_big.png");
            } else if (window.innerWidth >= 768) {
                setCurrentSrc("/location/location_mid.png");
            } else {
                setCurrentSrc("/location/location_sma.png");
            }
            setHasTriedFallback(false);
        };

        updateSrc();
        window.addEventListener("resize", updateSrc);
        return () => window.removeEventListener("resize", updateSrc);
    }, []);

    const handleError = () => {
        if (!hasTriedFallback) {
            setHasTriedFallback(true);
            // Fallback chain: big -> mid -> sma
            if (currentSrc.includes("location_big")) {
                setCurrentSrc("/location/location_mid.png");
            } else if (currentSrc.includes("location_mid")) {
                setCurrentSrc("/location/location_sma.png");
            }
            // If already on smallest, do nothing (will show broken image)
        }
    };

    return (
        <img 
            src={currentSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
}

