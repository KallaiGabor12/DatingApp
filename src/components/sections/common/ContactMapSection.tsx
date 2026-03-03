import { encode } from "html-entities";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatOpeningHours } from "@/lib/dateUtils";
import MapImage from "./MapImage";
export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function ContactMapSection({ id }: { id?: string }) {
    const contacts = (await prisma.contact.findFirst())!;

    const place = `${contacts.postal} ${contacts.city}, ${contacts.streetAddress}`;
    const clicklink = `https://www.google.com/maps?q=${encode(place)}&maptype=roadmap`;
    const email = contacts?.email ?? "EMAIL HERE";
    const phone = "+36 20 5550 150";
    const opentime = formatOpeningHours(contacts?.opens, contacts.closes, contacts.days);

    return <section className="w-full px-3 md:px-0 md:w-11/12 py-10 lg:py-20 mx-auto" id={id}>
        <div className="w-11/12 lg:w-full max-w-7xl mx-auto">
            <div className="md:flex items-center">
                <h2 className="text-dark text-tablet-h2 md:text-desktop-h2 mb-5 md:w-5/12">Kapcsolat</h2>
                {/* <p className="w-8/12 lg:my-0 my-5 lg:w-4/12">A Cool-Finish Kft. ipari és lakossági hűtés-, klíma- és légtechnikai rendszerek tervezésével, kivitelezésével és karbantartásával foglalkozik.</p> */}
                <ul className="grid w-full md:w-max md:grid-cols-2 md:justify-items-start md:content-center md:max-w-7/12 ml-auto">
                    <li className="flex items-center gap-2 my-2">
                        <Image src="/images/icons/clock.svg" alt="" aria-hidden="true" className="brightness-0 " width={24} height={24} />
                        <span className="sr-only">Nyitvatartás: </span>
                        <span className="text-[15px] sm:text-desktop-p text-dark">
                            {opentime}
                        </span>
                    </li>
                    <li className="items-center! my-2 ">
                        <Link href={"tel:" + phone.replace(/\s/g, '')} prefetch={false} className="flex items-center gap-2">
                            <Image src="/images/icons/phone.svg" alt="" aria-hidden="true" className="brightness-0" width={24} height={24} />
                            <span className="sr-only">Telefon: </span>
                            <span className="text-[15px] sm:text-desktop-p text-dark">
                                {phone}
                            </span>
                        </Link>
                    </li>
                    <li className="items-center! my-2 ">
                        <Link href={"mailto:" + email} prefetch={false} className="flex items-center gap-2">
                            <Image src="/images/icons/email.svg" alt="" aria-hidden="true" className="brightness-0" width={24} height={24} />
                            <span className="sr-only">E-mail: </span>
                            <span className="text-[15px] sm:text-desktop-p text-dark">
                                {email}
                            </span>
                        </Link>
                    </li>
                    <li className="my-2">
                        <Link href={clicklink} prefetch={false} target="_blank" className="flex items-center gap-2 max-w-full">
                            <Image src="/images/icons/location-dot.svg" alt="" aria-hidden="true" width={24} height={24} />
                            <span className="sr-only">Cím: </span>
                            <span className="text-[15px] sm:text-desktop-p text-dark">
                                {place}
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
            <hr role="presentation" className="border-t-2 border-main my-5" />
            <Link href={clicklink} prefetch={false} target="_blank" title="megjelenítés Google Maps-ben" className="block mt-0 lg:mt-7">
                <MapImage
                    alt={`Térkép: ${place}`}
                    className="w-full h-auto rounded-xl border-2 border-main"
                />
            </Link>
        </div>
    </section>
}
