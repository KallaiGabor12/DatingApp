"use client";
import ComponentCard from "@/components/common/ComponentCard";
import React, { useContext, useState, useEffect } from "react";
import { FAQContext } from "./FAQEditorPanel";
import RichTextEditor from "@/components/common/RichTextEditor";
import { JSONContent } from "@tiptap/react";
import FAQDropdown from "@/components/common/FAQDropdown";
import { FAQ } from "@prisma/client";
import { api } from "@/lib/axios";

export default function FAQEditorTop() {
    const ctx = useContext(FAQContext);
    const [question, setContentQ] = useState<JSONContent>()
    const [answer, setContentA] = useState<JSONContent>()
    const [feedback, setFeedback] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Store draft content when switching modes
    const [draftQuestion, setDraftQuestion] = useState<JSONContent | undefined>();
    const [draftAnswer, setDraftAnswer] = useState<JSONContent | undefined>();
    
    // Track the initial content for the editors (only updated when we want to programmatically change it)
    const [initialQuestion, setInitialQuestion] = useState<JSONContent | string | undefined>("");
    const [initialAnswer, setInitialAnswer] = useState<JSONContent | string | undefined>("");
    // Counter to force RichTextEditor to reset
    const [resetCounter, setResetCounter] = useState(0);

    // Clear feedback when switching between edit/create modes
    useEffect(() => {
        setFeedback("");
        setIsError(false);
    }, [ctx.selectedFAQ?.id])

    const isEditing = (): boolean => ctx.selectedFAQ != null;

    // Handle mode switching: save/restore draft content
    const prevSelectedIdRef = React.useRef<number | null>(null);
    
    useEffect(() => {
        const prevId = prevSelectedIdRef.current;
        const currentId = ctx.selectedFAQ?.id ?? null;
        
        // Only update if the selection actually changed
        if (currentId === prevId) {
            return;
        }
        
        if (currentId !== null) {
            // Switching TO edit mode: save current content as draft (if we're coming from create mode)
            if (prevId === null && (question || answer)) {
                setDraftQuestion(question);
                setDraftAnswer(answer);
            }
            // Load the selected FAQ content
            const newQuestion = ctx.selectedFAQ?.question as JSONContent;
            const newAnswer = ctx.selectedFAQ?.answer as JSONContent;
            setContentQ(newQuestion);
            setContentA(newAnswer);
            setInitialQuestion(newQuestion || "");
            setInitialAnswer(newAnswer || "");
        } else {
            // Switching TO create mode: restore draft content if available
            if (draftQuestion || draftAnswer) {
                setContentQ(draftQuestion);
                setContentA(draftAnswer);
                setInitialQuestion(draftQuestion || "");
                setInitialAnswer(draftAnswer || "");
            } else {
                // No draft, clear content
                setContentQ(undefined);
                setContentA(undefined);
                setInitialQuestion("");
                setInitialAnswer("");
            }
        }
        
        prevSelectedIdRef.current = currentId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.selectedFAQ?.id]);

    const handleSave = async () => {
        setIsError(false);
        if (!question || !answer) {
            setFeedback("A kérdés és válasz mező nem lehet üres.")
            setIsError(true);
            return;
        }
        if (!ctx.selectedFAQ) {
            setFeedback("Nincs kiválasztott GYIK objektum.")
            setIsError(true);
            return;
        }

        setIsLoading(true);
        try {
            const result = await api.post("/admin/faq/modify", {
                id: ctx.selectedFAQ.id,
                question: question,
                answer: answer
            });
            
            if (result.data.success) {
                setIsError(false);
                setFeedback(result.data.message);
                // Clear fields
                setContentQ(undefined);
                setContentA(undefined);
                // Force RichTextEditor to reset by incrementing counter and setting empty content
                setResetCounter(prev => prev + 1);
                setInitialQuestion("");
                setInitialAnswer("");
                // Clear draft content after successful save
                setDraftQuestion(undefined);
                setDraftAnswer(undefined);
                // Update FAQ list
                await handleFAQListUpdate();
                // Set selected FAQ to null after successful save
                ctx.setSelected(null);
                ctx.setPreviousSelected(null);
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

    const handleUndo = () => {
        // Clear the selection and restore draft content
        ctx.setSelected(null);
        ctx.setPreviousSelected(null);
        // Draft content will be restored via useEffect
    };

    useEffect(()=>{
    }, [feedback])
    const handleCreate = async () => {
        setIsError(false);
        if (!question || !answer) {
            setFeedback("A kérdés és válasz mező nem lehet üres.")
            setIsError(true);
            return;
        }

        const newFAQ: Omit<FAQ, "id"> = {
            question: question,
            answer: answer,
        };

        setIsLoading(true);
        try {
            const result = await api.post<{ success: boolean, message: string }>("/admin/faq/create", { faqObject: newFAQ });
            if (result.data.success) {
                setIsError(false);
                setFeedback(result.data.message);
                // Clear fields
                setContentQ(undefined);
                setContentA(undefined);
                // Force RichTextEditor to reset by incrementing counter and setting empty content
                setResetCounter(prev => prev + 1);
                setInitialQuestion("");
                setInitialAnswer("");
                // Clear draft content after successful creation
                setDraftQuestion(undefined);
                setDraftAnswer(undefined);
                // Update FAQ list
                await handleFAQListUpdate();
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

    const handleFAQListUpdate = async () => {
        try {
            const response = await api.post<{ success: boolean, records?: FAQ[] }>("/admin/faq/getall");
            if (response.data.success && response.data.records) {
                ctx.setFAQs(response.data.records);
            }
        } catch (error) {
            console.error("Failed to update FAQ list:", error);
        }
    }

    return <ComponentCard title={`${isEditing() ? "Kérdés-Válasz pár szerkesztése" : "Új Kérdés-Válasz pár létrehozása"}`} className="my-4">
        <div className="w-full flex flex-row items-stretch justify-between">
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
                    key={`faq-question-${resetCounter}`}
                    setContentJSON={(content) => { 
                        setContentQ(content);
                    }}
                    linkDisabled
                    label="Kérdés"
                    color="text-main"
                    boldDisabled={true}
                    initialContent={initialQuestion}
                    disabled={isLoading}
                />
                <RichTextEditor
                    key={`faq-answer-${resetCounter}`}
                    setContentJSON={(content) => { 
                        setContentA(content);
                    }}
                    label="Válasz"
                    color="text-default"
                    initialContent={initialAnswer}
                    disabled={isLoading}
                />

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
            <ul className="w-7/12 flex items-center justify-center">
                <FAQDropdown record={{
                    answer: answer!,
                    question: question!,
                    id: -1
                }} />
            </ul>
        </div>
    </ComponentCard>
}