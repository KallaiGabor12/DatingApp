import ComponentCard from "@/components/common/ComponentCard";
import { useContext, useEffect } from "react";
import { TestimonialContext } from "./TestimonialEditorPanel";
import TestimonialCard from "@/components/common/TestimonialCard";
import { api } from "@/lib/axios";
import { Testimonial } from "@prisma/client";

export default function TestimonialEditorBottom() {
    const ctx = useContext(TestimonialContext);
    const setInitialTestimonials = async () => {
        try {
            const response = await api.post<{ success: boolean, records?: Testimonial[] }>("/admin/testimonial/getall");
            if (response?.data?.success && response.data.records) {
                ctx.setTestimonials(response.data.records)
            }
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
        }
    }
    useEffect(() => {
        setInitialTestimonials();
    }, [])

    const handleDelete = async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            const deleteResponse = await api.post<{ success: boolean; message?: string }>("/admin/testimonial/delete", {id:id});
            ctx.setSelected(null);
            return deleteResponse?.data || { success: false, message: "Unknown error" };
        } catch (error) {
            console.error("Failed to delete testimonial:", error);
            return { success: false, message: "Törlés sikertelen" };
        }
    }

    const refreshTestimonialList = async () => {
        try {
            const response = await api.post<{ success: boolean, records?: Testimonial[] }>("/admin/testimonial/getall");
            if (response?.data?.success && response.data.records) {
                ctx.setTestimonials(response.data.records)
            }
        } catch (error) {
            console.error("Failed to refresh testimonial list:", error);
        }
    }
    return <ComponentCard title={`Jelenlegi vélemények (${ctx.Testimonials.length})`} className="my-4">

        {ctx.Testimonials.length != 0 &&
            <div role="list" className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {ctx.Testimonials.map((t) => (
                    <div key={t.id} className="relative">
                        <TestimonialCard 
                            record={t} 
                            defaultExpanded={true} 
                            isSelectable={true} 
                            forceExpanded={true} 
                            onDelete={handleDelete} 
                            onAfterDeleteSuccess={refreshTestimonialList} 
                            className="h-full"
                        />
                    </div>
                ))}
            </div>}

        {ctx.Testimonials.length == 0 &&
            <p className="text-default">Még nincs bejegyzett vélemény.</p>}
    </ComponentCard>
}

