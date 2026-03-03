import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function RelatedServicesSection({ links, alt, children, imageSource }: { links: { text: string, href: string }[], children?: ReactNode, imageSource: string, alt: string }) {
    return <>
        <section className="w-full md:max-w-full max-w-11/12 mx-auto gap-0 pt-4 md:pt-0 md:flex items-stretch md:min-h-[50vh]">
            <h2 className="text-[#1D3C6D] uppercase py-3 text-[18px] text-center sm:text-tablet-h2 md:hidden">Kapcsolódó szolgáltatások</h2>
            <div className="w-full md:w-5/12 aspect-square md:aspect-auto relative">
                <Image src={imageSource} alt={alt} fill className="object-cover [overflow-clip-margin:unset] object-[50%_50%] rounded-md md:rounded-none" />
                
            </div>
            <div className="mt-3 md:mt-5 md:w-7/12 md:pl-20 md:pr-10 2xl:pr-[5%] 3xl:pr-[15%] 2xl:pl-42 3xl:pl-52">
                <hr className="border border-black/30 mb-1 md:hidden" />
                <h2 className="text-[#1D3C6D] uppercase py-3 text-tablet-h2 text-left hidden md:block 2xl:text-[min(max(25px,2.3vw),40px)]">Kapcsolódó szolgáltatások</h2>
                {children}
                <hr className="border border-black/30 my-3" />
                {links.length != 0 &&
                    <ul className="flex flex-wrap gap-x-3 gap-y-2 mt-5 max-w-10/12 w-max mb-10">
                        {links.map((l, i) =>
                            <li key={i}>
                                <Link href={l.href} className="bg-white w-max hover:underline w-48 h-10 flex min-w-max pr-4 hover:scale-105 duration-100 items-center justify-start rounded-full border border-main shadow-[4px_4px_10px_0_#000a] text-default uppercase font-medium">
                                    <Image src={"/images/icons/checkmark.svg"} alt="" role="presentation" width={25} height={25} className="ml-2 mr-1" />
                                    <span>{l.text}</span>
                                    <Image src={"/images/icons/newtab.png"} alt="" role="presentation" width={10} height={10} className="relative bottom-2" />
                                </Link>
                            </li>
                        )}
                    </ul>}

                {links.length != 0 &&
                    <>
                        <p className="sr-only">Kapcsolódó szolgálatás linkek:</p>
                        <div className="sr-only" role="list">
                            {links.map((l, i) =>
                                <Link href={l.href} key={i} role="listitem">
                                    <span>{l.text},</span>
                                </Link>
                                
                            )}
                        </div>
                    </>}
            </div>
        </section>
    </>
}