import LogsAdminPanel from "@/components/admin/logs/LogsAdminPanel";
import ContactsEditorPanel from "@/components/admin/password/ContactsEditorPanel";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 0;
export const metadata: Metadata = {
    title:
        "Rendszernapló - Cool-Finish ADMIN",
    robots: {
        index: false,
        follow: false,
    },
};
export default async function ContactsAdmin(){
    return <div>
        <PageBreadcrumb pageTitle="Rendszernapló" />
        <LogsAdminPanel />
    </div>
}