"use client";
import ComponentCard from "@/components/common/ComponentCard";
import React, { useContext, useState, useEffect } from "react";
import { TestimonialContext } from "./TestimonialEditorPanel";
import RichTextEditor from "@/components/common/RichTextEditor";
import { JSONContent } from "@tiptap/react";
import TestimonialCard from "@/components/common/TestimonialCard";
import { Testimonial } from "@prisma/client";
import { api } from "@/lib/axios";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function TestimonialEditorTop() {
    const ctx = useContext(TestimonialContext);
    const [content, setContent] = useState<JSONContent>()
    const [name, setName] = useState<string>("");
    const [place, setPlace] = useState<string>("");
    const [rating, setRating] = useState<number>(5);
    const [ratingInput, setRatingInput] = useState<string>("5");
    const [feedback, setFeedback] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Store draft content when switching modes
    const [draftContent, setDraftContent] = useState<JSONContent | undefined>();
    const [draftName, setDraftName] = useState<string>("");
    const [draftPlace, setDraftPlace] = useState<string>("");
    const [draftRating, setDraftRating] = useState<number>(5);
    
    // Track the initial content for the editor
    const [initialContent, setInitialContent] = useState<JSONContent | string | undefined>("");
    // Counter to force RichTextEditor to reset
    const [resetCounter, setResetCounter] = useState(0);

    // Clear feedback when switching between edit/create modes
    useEffect(() => {
        setFeedback("");
        setIsError(false);
    }, [ctx.selectedTestimonial?.id])

    const isEditing = (): boolean => ctx.selectedTestimonial != null;
    const clamp = (min: number, val: number, max:number) =>{
        if(val < min) return min;
        if(val > max) return max;
        return val;
    }
    // Handle mode switching: save/restore draft content
    const prevSelectedIdRef = React.useRef<number | null>(null);
    
    useEffect(() => {
        const prevId = prevSelectedIdRef.current;
        const currentId = ctx.selectedTestimonial?.id ?? null;
        
        // Only update if the selection actually changed
        if (currentId === prevId) {
            return;
        }
        
        if (currentId !== null) {
            // Switching TO edit mode: save current content as draft (if we're coming from create mode)
            if (prevId === null && (content || name || place)) {
                setDraftContent(content);
                setDraftName(name);
                setDraftPlace(place);
                setDraftRating(rating);
            }
            // Load the selected testimonial content
            const newContent = ctx.selectedTestimonial?.content as JSONContent;
            setContent(newContent);
            setName(ctx.selectedTestimonial?.name || "");
            setPlace(ctx.selectedTestimonial?.place || "");
            const newRating = ctx.selectedTestimonial?.rating || 5;
            setRating(newRating);
            setRatingInput(newRating.toString().replace('.', ','));
            setInitialContent(newContent || "");
        } else {
            // Switching TO create mode: restore draft content if available
            if (draftContent || draftName || draftPlace) {
                setContent(draftContent);
                setName(draftName);
                setPlace(draftPlace);
                setRating(draftRating);
                setRatingInput(draftRating.toString().replace('.', ','));
                setInitialContent(draftContent || "");
            } else {
                // No draft, clear content
                setContent(undefined);
                setName("");
                setPlace("");
                setRating(5);
                setInitialContent("");
            }
        }
        
        prevSelectedIdRef.current = currentId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.selectedTestimonial?.id]);

    const handleSave = async () => {
        setIsError(false);
        if (!content) {
            setFeedback("A tartalom mező nem lehet üres.")
            setIsError(true);
            return;
        }
        if (!ctx.selectedTestimonial) {
            setFeedback("Nincs kiválasztott vélemény objektum.")
            setIsError(true);
            return;
        }
        if (rating < 0 || rating > 5) {
            setFeedback("Az értékelés 0 és 5 között kell legyen.")
            setIsError(true);
            return;
        }

        setIsLoading(true);
        try {
            const result = await api.post("/admin/testimonial/modify", {
                id: ctx.selectedTestimonial.id,
                content: content,
                name: name || null,
                place: place || null,
                rating: rating
            });
            
            if (result.data.success) {
                setIsError(false);
                setFeedback(result.data.message);
                // Clear fields
                setContent(undefined);
                setName("");
                setPlace("");
                setRating(5);
                setRatingInput("5");
                // Force RichTextEditor to reset by incrementing counter and setting empty content
                setResetCounter(prev => prev + 1);
                setInitialContent("");
                // Clear draft content after successful save
                setDraftContent(undefined);
                setDraftName("");
                setDraftPlace("");
                setDraftRating(5);
                // Update testimonial list
                await handleTestimonialListUpdate();
                // Set selected testimonial to null after successful save
                ctx.setSelected(null);
                ctx.setPreviousSelected(null);
            } else {
                setIsError(true);
                setFeedback(result.data.message);
            }
        } catch (error: any) {
            setIsError(true);
            const errorMessage = error?.response?.data?.message || error?.message || "Hiba történt a mentés során";
            setFeedback(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUndo = () => {
        // Clear the selection and restore draft content
        ctx.setSelected(null);
        ctx.setPreviousSelected(null);
        // Draft content will be restored via useEffect
    };

    const handleCreate = async () => {
        setIsError(false);
        if (!content) {
            setFeedback("A tartalom mező nem lehet üres.")
            setIsError(true);
            return;
        }
        if (rating < 0 || rating > 5) {
            setFeedback("Az értékelés 0 és 5 között kell legyen.")
            setIsError(true);
            return;
        }

        const newTestimonial: Omit<Testimonial, "id"> = {
            content: content,
            name: name || null,
            place: place || null,
            rating: rating,
        };

        setIsLoading(true);
        try {
            const result = await api.post<{ success: boolean, message: string }>("/admin/testimonial/create", { testimonialObject: newTestimonial });
            if (result.data.success) {
                setIsError(false);
                setFeedback(result.data.message);
                // Clear fields
                setContent(undefined);
                setName("");
                setPlace("");
                setRating(5);
                setRatingInput("5");
                // Force RichTextEditor to reset by incrementing counter and setting empty content
                setResetCounter(prev => prev + 1);
                setInitialContent("");
                // Clear draft content after successful creation
                setDraftContent(undefined);
                setDraftName("");
                setDraftPlace("");
                setDraftRating(5);
                // Update testimonial list
                await handleTestimonialListUpdate();
            } else {
                setIsError(true);
                setFeedback(result.data.message);
            }
        } catch (error: any) {
            setIsError(true);
            const errorMessage = error?.response?.data?.message || error?.message || "Hiba történt a létrehozás során";
            setFeedback(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestimonialListUpdate = async () => {
        try {
            const response = await api.post<{ success: boolean, records?: Testimonial[] }>("/admin/testimonial/getall");
            if (response.data.success && response.data.records) {
                ctx.setTestimonials(response.data.records);
            }
        } catch (error) {
            console.error("Failed to update testimonial list:", error);
        }
    }

    return <ComponentCard title={`${isEditing() ? "Vélemény szerkesztése" : "Új vélemény létrehozása"}`} className="my-4">
        <div className="w-full flex flex-row items-stretch justify-between gap-6">
            <div className="space-y-4 w-5/12">
                {feedback && (
                    <p className={`empty:hidden border-2 rounded-sm w-max py-1 px-2 my-2 ${
                        isError 
                            ? "bg-red-300 text-red-700 border-red-500" 
                            : "bg-green-500/20 border-green-500 text-green-800"
                    }`}>
                        {feedback}
                    </p>
                )}
                <RichTextEditor
                    key={`testimonial-editor-${resetCounter}`}
                    setContentJSON={(content) => { 
                        setContent(content);
                    }}
                    linkDisabled
                    label="Vélemény tartalma"
                    color="text-default"
                    initialContent={initialContent}
                    disabled={isLoading}
                />
                <div>
                    <Label>Név (opcionális)</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Pl: A kis Vuk"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label>Helyszín (opcionális)</Label>
                    <Input
                        type="text"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        placeholder="Pl: Debrecen"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label>Értékelés (0-5)</Label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm flex items-center justify-center shadow-theme-xs">
                            <span className="text-gray-800 dark:text-white/90">
                                {rating.toString().replace('.', ',')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    const newRating = clamp(0, rating + 0.5, 5);
                                    setRating(newRating);
                                    setRatingInput(newRating.toString().replace('.', ','));
                                }}
                                disabled={isLoading || rating >= 5}
                                className="h-5 w-6 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-t-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const newRating = clamp(0, rating - 0.5, 5);
                                    setRating(newRating);
                                    setRatingInput(newRating.toString().replace('.', ','));
                                }}
                                disabled={isLoading || rating <= 0}
                                className="h-5 w-6 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-b-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    {isEditing() ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Mentés..." : "Mentés"}
                            </button>
                            <button
                                onClick={handleUndo}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Kijelölés törlése
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleCreate}
                            disabled={isLoading}
                            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Létrehozás..." : "Létrehozás"}
                        </button>
                    )}
                </div>
            </div>
            <div className="w-7/12 flex items-center justify-center">
                {content && (
                    <TestimonialCard record={{
                        content: content!,
                        name: name || "Névtelen",
                        place: place || null,
                        rating: rating,
                        id: -1
                    }} />
                )}
            </div>
        </div>
    </ComponentCard>
}

