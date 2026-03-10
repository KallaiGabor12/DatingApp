import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function UserManual() {
  return (<>
    <PageBreadcrumb pageTitle="Settings" />
    <ComponentCard title="Your Profile" className="my-4">
      this is your profile page
    </ComponentCard>
  </>);
}
