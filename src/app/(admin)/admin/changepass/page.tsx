import PasswordChangePanel from "@/components/admin/password/PasswordChangePanel";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "Jelszó változtatás - COOL-FINISH KFT.",
    robots: {
        index: false,
        follow: false,
    },
};
export default function ChangePass() {
    return (<div>
        <PageBreadcrumb pageTitle="Jelszó változtatás" />
        <PasswordChangePanel />
    </div>)
}