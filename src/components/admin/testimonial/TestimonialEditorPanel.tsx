"use client"
import { Testimonial } from "@prisma/client";
import { createContext, useState } from "react"
import TestimonialEditorTop from "@/components/admin/testimonial/TestimonialEditorTop";
import TestimonialEditorBottom from "@/components/admin/testimonial/TestimonialEditorBottom";


export const TestimonialContext = createContext<{
    Testimonials: Testimonial[],
    setTestimonials: (t: Testimonial[]) => void,
    selectedTestimonial: Testimonial | null,
    setSelected: (t: Testimonial | null) => void,
    previousSelectedTestimonial: Testimonial | null,
    setPreviousSelected: (t: Testimonial | null) => void,
}>(
    {
        Testimonials: [],
        setTestimonials: () => { },
        selectedTestimonial: null,
        setSelected: () => { },
        previousSelectedTestimonial: null,
        setPreviousSelected: () => { },
    }
);


export const revalidate = 0;
export default function TestimonialEditorPanel() {
    const [selectedTestimonial, setSelected] = useState<Testimonial | null>(null);
    const [previousSelectedTestimonial, setPreviousSelected] = useState<Testimonial | null>(null);
    const [Testimonials, setTestimonials] = useState<Testimonial[]>([]);

    return <>
        <TestimonialContext.Provider value={{
            Testimonials: Testimonials,
            selectedTestimonial: selectedTestimonial,
            setTestimonials: (t: Testimonial[]) => { setTestimonials(t) },
            setSelected: (t: Testimonial | null) => { setSelected(t) },
            previousSelectedTestimonial: previousSelectedTestimonial,
            setPreviousSelected: (t: Testimonial | null) => { setPreviousSelected(t) },
        }}>
            <TestimonialEditorTop />
            <TestimonialEditorBottom />
        </TestimonialContext.Provider>
    </>
}

