import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default async function ProsSection({ children, smallList, image }: { children?: ReactNode, smallList: string[], image?: {path:string,alt:string,title?:string} }) {
    const mail = (await prisma.contact.findFirst())?.email;

    return <section className="bg-main w-full text-white mb-10 pt-12 lg:pb-12 overflow-x-hidden max-w-full md:flex lg:px-[3%] md:flex-row-reverse md:items-stretch lg:justify-between sm:px-[6%] 2xl:justify-center 2xl:gap-20"> 
        <div className="w-11/12 sm:w-11/12 md:max-w-[600px] 2xl:w-full mx-auto flex items-center gap-7 justify-center mb-2 sm:gap-12 md:gap-1 lg:gap-10 sm:mb-10 lg:w-7/12 lg:justify-between md:flex-col md:justify-center lg:flex-row md:w-5/12 2xl:justify-start 2xl:mx-0">
            <div className="relative w-7/12 sm:w-11/12 md:h-full md:min-h-52 md:w-auto lg:h-full aspect-2/3 lg:w-5/12 mx-auto 2xl:w-6/12 2xl:mx-0">
                {!image &&
                    <Image src={"/images/components/imagebg.png"} alt="" role="presentation" fill className="object-[55%_100%] object-cover 
                [overflow-clip-margin:unset] rounded-xl shadow-black/40 shadow-md" />
                }
                {image && 
                    <Image src={image.path} alt={image.alt} title={image.title} role="presentation" fill className="object-[55%_100%] object-cover 
                [overflow-clip-margin:unset] rounded-xl shadow-black/40 shadow-md" />
                }
                
                <Link href={"mailto:" + mail} className="absolute top-2 left-5/12 w-max bg-[#6C90EA] py-3 px-5 -skew-x-12 scale-105 
                rounded-md hover:scale-110 duration-100 md:scale-80 md:hover:scale-85 md:left-2/12 lg:scale-105 lg:hover:scale-110">

                    <p className="my-0 py-0 flex flex-col gap-0 text-center">
                        <span className="text-desktop-p/[1] lg:text-tablet-h2/[1] my-0 py-0 font-medium">{mail} </span>
                        
                    </p>

                </Link>
            </div>
            <ul className="list-disc w-5/12 lg:w-1/2 md:h-max md:w-max 2xl:w-6/12 ">
                {smallList.map((l, i) => <li key={i} className="py-2 text-[14px]/[1.2] 2xl:text-[23px]/[1.2] sm:text-[max(17px,2vw)] lg:text-[18px] font-semibold md:ml-10" ><span className="relative -left-2 md:left-0">{l}</span></li>)}
            </ul>
        </div>
        <div className="w-11/12 mx-auto 2xl:mx-0  mt-5 lg:w-4/12 md:max-w-[600px]">
            <h2 className="text-tablet-h2/[1.2] mb-3 md:text-desktop-h2/[1.2] 2xl:text-desktop-h2! uppercase">Előnyök</h2>
            {children}
        </div>
    </section>
}