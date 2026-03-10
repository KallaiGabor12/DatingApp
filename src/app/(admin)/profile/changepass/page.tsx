import PasswordChangePanel from "@/components/admin/password/PasswordChangePanel";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"

export default function ChangePass() {
    return (<div>
        <PageBreadcrumb pageTitle="Jelszó változtatás" />
        <PasswordChangePanel />
    </div>)
}