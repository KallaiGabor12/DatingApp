"use client"
import { ReferenceGroup } from "@prisma/client";
import { useContext } from "react";
import { ViewerContext } from "./GalleryDisplay";
import clsx from "clsx";

export default function GroupSelector({ groups }: { groups: ReferenceGroup[] }) {
    const context = useContext(ViewerContext);
    
    if (!context) return null;

    const { group, mode } = context;

    return (
        <div className={`flex flex-col-reverse items-center justify-between gap-8 mb-6 w-11/12 mx-auto mt-8 ${context.mode.get != "all" ? "max-w-5xl" : "max-w-6xl"}`}>
            {/* Group Selection */}
            <div className="flex-1 w-full md:w-auto flex items-center justify-center flex-wrap gap-5" role="tablist" aria-label="Kategória választó">
                <button
                    type="button"
                    role="tab"
                    aria-selected={!group.get}
                    aria-controls="gallery-group-all"
                    onClick={() => group.set(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            group.set(null);
                        }
                    }}
                    className={clsx(
                        "text-black font-normal cursor-pointer text-[16px] transition-colors bg-transparent border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 rounded",
                        !group.get ? "text-main font-bold!" : "hover:text-main"
                    )}
                >
                    Összes
                </button>
                {groups.map((g) => (
                    <button
                        key={g.id}
                        type="button"
                        role="tab"
                        aria-selected={group.get?.id === g.id}
                        aria-controls={`gallery-group-${g.id}`}
                        onClick={() => group.set(g)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                group.set(g);
                            }
                        }}
                        className={clsx(
                            "text-black font-normal cursor-pointer text-[16px] transition-colors bg-transparent border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 rounded",
                            group.get?.id === g.id ? "text-main font-bold!" : "hover:text-main"
                        )}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-medium">Nézet:</span>
                <div className="flex bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Nézet mód választó">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode.get === "all"}
                        aria-controls="gallery-all-view"
                        onClick={() => mode.set("all")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 ${
                            mode.get === "all"
                                ? "bg-main text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Összes
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode.get === "carousel"}
                        aria-controls="gallery-carousel-view"
                        onClick={() => mode.set("carousel")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 ${
                            mode.get === "carousel"
                                ? "bg-main text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Képváltó
                    </button>
                </div>
            </div>
        </div>
    );
}

