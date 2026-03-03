import { prisma } from "@/lib/prisma";
import TopNav from "./TopNav";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function Header() {
    const contact = await prisma.contact.findFirst();
    return <TopNav contact={contact!} />
}
