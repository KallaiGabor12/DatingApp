import ComponentCard from "@/components/common/ComponentCard";
import { useContext, useEffect } from "react";
import { FAQContext } from "./FAQEditorPanel";
import FAQDropdown from "@/components/common/FAQDropdown";
import { api } from "@/lib/axios";
import { FAQ } from "@prisma/client";

export default function FAQEditorBottom() {
    const ctx = useContext(FAQContext);
    const setInitialFAQs = async () => {
        try {
            const response = await api.post<{ success: boolean, records?: FAQ[] }>("/admin/faq/getall");
            if (response?.data?.success && response.data.records) {
                ctx.setFAQs(response.data.records)
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        }
    }
    useEffect(() => {
        setInitialFAQs();
    }, [])

    const handleDelete = async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            const deleteResponse = await api.post<{ success: boolean; message?: string }>("/admin/faq/delete", {id:id});
            ctx.setSelected(null);
            return deleteResponse?.data || { success: false, message: "Unknown error" };
        } catch (error) {
            console.error("Failed to delete FAQ:", error);
            return { success: false, message: "Törlés sikertelen" };
        }
    }

    const refreshFAQList = async () => {
        try {
            const response = await api.post<{ success: boolean, records?: FAQ[] }>("/admin/faq/getall");
            if (response?.data?.success && response.data.records) {
                ctx.setFAQs(response.data.records)
            }
        } catch (error) {
            console.error("Failed to refresh FAQ list:", error);
        }
    }
    return <ComponentCard title={`Jelenlegi Kérdések és Válaszok (${ctx.FAQs.length})`} className="my-4">

        {ctx.FAQs.length != 0 &&
            <div role="list" className="grid gap-x-6 grid-cols-2">
                <div className="flex flex-col gap-2">
                    {ctx.FAQs.map((f,i) => i < ctx.FAQs.length/2 ? <FAQDropdown key={f.id} record={f} defaultExpanded={true} isSelectable={true} forceExpanded={true} onDelete={handleDelete} onAfterDeleteSuccess={refreshFAQList} stretch={true} className="h-min"/> : "")}
                </div>
                <div className="flex flex-col gap-2">
                    {ctx.FAQs.map((f,i) => i >= ctx.FAQs.length/2 ? <FAQDropdown key={f.id} record={f} defaultExpanded={true} isSelectable={true} forceExpanded={true} onDelete={handleDelete} onAfterDeleteSuccess={refreshFAQList} stretch={true} className="h-min"/> : "")}
                </div>
            </div>}

        {ctx.FAQs.length == 0 &&
            <p className="text-default">Még nincs bejegyzett Kérdés-Válasz páros.</p>}
    </ComponentCard>
}