"use client"
import { FAQ } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react"
import FAQEditorTop from "@/components/admin/faq/FAQEditorTop";
import FAQEditorBottom from "@/components/admin/faq/FAQEditorBottom";
import { api } from "@/lib/axios";


export const FAQContext = createContext<{
    FAQs: FAQ[],
    setFAQs: (f: FAQ[]) => void,
    selectedFAQ: FAQ | null,
    setSelected: (f: FAQ | null) => void,
    previousSelectedFAQ: FAQ | null,
    setPreviousSelected: (f: FAQ | null) => void,
}>(
    {
        FAQs: [],
        setFAQs: () => { },
        selectedFAQ: null,
        setSelected: () => { },
        previousSelectedFAQ: null,
        setPreviousSelected: () => { },
    }
);


export const revalidate = 0;
export default function FAQEditorPanel() {
    const [selectedFAQ, setSelected] = useState<FAQ | null>(null);
    const [previousSelectedFAQ, setPreviousSelected] = useState<FAQ | null>(null);
    const [FAQs, setFAQs] = useState<FAQ[]>([]);

    return <>
        <FAQContext.Provider value={{
            FAQs: FAQs,
            selectedFAQ: selectedFAQ,
            setFAQs: (f: FAQ[]) => { setFAQs(f) },
            setSelected: (f: FAQ | null) => { setSelected(f) },
            previousSelectedFAQ: previousSelectedFAQ,
            setPreviousSelected: (f: FAQ | null) => { setPreviousSelected(f) },
        }}>
            <FAQEditorTop />
            <FAQEditorBottom />
        </FAQContext.Provider>
    </>
}