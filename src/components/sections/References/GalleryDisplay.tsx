"use client"
import { ReferenceGroup, ReferenceImage } from "@prisma/client";
import { createContext, useState, useMemo } from "react";
import GroupSelector from "./GroupSelector";
import GalleryDisplayAll from "./GalleryDisplayAll";
import GalleryCarousel from "./GalleryCarousel";

export const ViewerContext = createContext<{
    group: {
        get: ReferenceGroup | null,
        set: (p: ReferenceGroup | null) => void
    },
    mode: {
        get: "carousel" | "all",
        set: (p: "carousel" | "all") => void,
    },
    images: ReferenceImage[]
}|null>(null);

export default function GalleryDisplay({ groups, images }: { groups: ReferenceGroup[], images: ReferenceImage[] }) {
    const [selectedGroup, setSelectedGroup] = useState<ReferenceGroup | null>(null); // null means "Összes" (All)
    const [mode, setMode] = useState<"carousel" | "all">("all");

    // Filter images by selected group or show all
    const filteredImages = useMemo(() => {
        if (selectedGroup === null) {
            // Show all images, sorted by most recent first (timestamp descending, then id descending)
            return [...images].sort((a, b) => {
                if (b.timestamp !== a.timestamp) {
                    return b.timestamp - a.timestamp;
                }
                return b.id - a.id;
            });
        }
        // Filter by selected group and sort by order
        return images.filter(img => img.groupID === selectedGroup.id).sort((a, b) => a.order - b.order);
    }, [selectedGroup, images]);

    const contextValue = {
        group: {
            get: selectedGroup,
            set: setSelectedGroup
        },
        mode: {
            get: mode,
            set: setMode
        },
        images: filteredImages
    };

    return (
        <section className="mt-7 mb-3 w-11/12 mx-auto" aria-labelledby="gallery-heading">
            <h2 id="gallery-heading" className="font-bold text-center mt-0 text-desktop-h2 lg:text-[50px]">Galéria</h2>
            <p className="text-main text-mobile-h2 font-bold text-center mb-2 md:text-tablet-h2">Munkáink kategóriák szerint</p>
            {/* <p className="text-default text-center max-w-2xl mx-auto"></p> */}
            <ViewerContext.Provider value={contextValue}>
                <GroupSelector groups={groups} />
                {mode === "all" ? <GalleryDisplayAll /> : <GalleryCarousel />}
            </ViewerContext.Provider>
        </section>
    );
}