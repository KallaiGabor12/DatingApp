import LogsAdminPanel from "@/components/admin/logs/LogsAdminPanel";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"

export const revalidate = 0;
export default async function ContactsAdmin(){
    return <div>
        <PageBreadcrumb pageTitle="Rendszernapló" />
        <LogsAdminPanel />
    </div>
}