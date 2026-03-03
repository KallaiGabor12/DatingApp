"use client"
import { ReferenceGroup, ReferenceImage } from "@prisma/client";
import { createContext, useState } from "react";
import GroupSelector from "./GroupSelector";
import ImagesManager from "./ImagesManager";

export const GalleryContext = createContext<{
    images: {
        get: ReferenceImage[],
        set: (p: ReferenceImage[]) => void,
    }
    groups: {
        get: ReferenceGroup[],
        selected: {
            get: ReferenceGroup | null,
            set: (p: ReferenceGroup) => void
        }
    }
}
>({
    images: {
        get: [],
        set: () => { },
    },
    groups: {
        get: [],
        selected: {
            get: null,
            set: () => { }
        }
    }
});
export default function GalleryEditor({ defgroups }: { defgroups: ReferenceGroup[] }) {
    const [images, setImages] = useState<ReferenceImage[]>([]);
    const [currentGroup, setCurrentGroup] = useState<ReferenceGroup | null>(defgroups[0] ?? null);

    return <GalleryContext.Provider value={{
        images: {
            get: images,
            set: setImages,
        },
        groups: {
            get: defgroups,
            selected: {
                get: currentGroup,
                set: setCurrentGroup,
            }
        }
    }}>

        <GroupSelector />
        <ImagesManager />

    </GalleryContext.Provider>
}