import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Image from "next/image";
import ComponentCard from "@/components/common/ComponentCard";

export const metadata: Metadata = {
  title:
    "Admin felület - COOL-FINISH KFT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserManual() {
  return (<>
    <PageBreadcrumb pageTitle="Használati útmutató" />
    <ComponentCard title="Jelszó megváltoztatása (bejelentkezve)" className="my-4">
      <h1>asd</h1>
    </ComponentCard>
  </>);
}
