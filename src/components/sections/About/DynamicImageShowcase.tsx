import CTALink from "@/components/ui/button/CTA";
import TextSection from "./TextSection";
import Image from "next/image";
import { Hedvig_Letters_Sans } from "next/font/google";
import { prisma } from "@/lib/prisma";

export default async function DynamicImageShowcase({standalone = false}) {
    const images = await prisma.referenceImage.findMany({take:4, orderBy: {timestamp: 'desc'}}) ?? [];
    return <TextSection standalone={standalone}>
        <h2 className="text-tablet-h2 md:text-desktop-h2">Munkáink képekben</h2>
        <p className="text-desktop-p my-4 text-default md:text-[20px]"><span className="sm:block sm:font-bold sm:text-black">Hosszú távú megbízhatóság</span> Változó körülmények között is felelősségteljesen dolgozunk.</p>
        <CTALink href="/referenciak" className="my-3 mb-6">Érdekel</CTALink>
        <div className="grid sm:grid-cols-2 sm:grid-rows-2 gap-4 xl:grid-cols-4 xl:grid-rows-1 relative">
            {images.map((img, i) => <Image src={"/api/uploads/references/"+img.filename} alt={img.alt} fill key={i} className="rounded-md relative! object-cover [clip-margin-overflow:unset]" />)}
        </div>

    </TextSection>
}