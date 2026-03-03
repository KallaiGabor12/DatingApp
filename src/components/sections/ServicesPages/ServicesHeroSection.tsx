import { prisma } from "@/lib/prisma"
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react"

export default async function ServicesHeroSection({ category, title, description, imageSource, alt }: {
    category: string, title: string, imageSource: string, description: ReactNode, alt: string
}) {
    const mail = (await prisma.contact.findFirst())!.email;
    return <section className="w-full bg-main pt-6 flex-col flex max-w-full overflow-x-hidden md:h-[calc(100vh-80px)] lg:h-[calc(100vh-135px)]">

        <div className="grid md:flex items-center justify-between md:max-w-[min(80vw,980px)] lg:max-w-[min(1024px,90vw)] md:w-full mx-auto md:mb-0
        3xl:max-w-[clamp(1300px,80vw,1600px)] grow">
            <h1 className="text-left w-max max-w-full text-white! mx-auto my-4 md:w-max md:mx-0">
                <span className="font-medium text-dekstop-p sm:text-[18px]/[1] lg:text-tablet-h2 3xl:text-desktop-h2">{category} - </span><br />
                <span className="text-tablet-h2/[1] sm:text-tablet-h2/[1] lg:text-desktop-h2 3xl:text-desktop-h1">{title}</span>
            </h1>
            <Link href={"mailto:" + mail} className="flex items-center justify-center gap-1 mx-auto max-w-full my-2 md:w-max md:mx-0 hover:scale-105 duration-100">
                <div className="w-8 h-8 lg:w-12 lg:h-12 3xl:w-20 3xl:h-20 relative">
                    <Image src={"/images/icons/email2.svg"} alt="Email ikonja" fill className="object-cover [-webkit-margin-overflow:unset]" />
                </div>
                <p className="text-[14px]/[1] md:text-[14px]/[1] 3xl:text-[20px]/[1] text-white font-semibold">
                    <span className="text-[20px]/[1] md:text-[20px]/[1] lg:text-tablet-h2/[1] 3xl:text-desktop-h2">{mail} </span> <br />
                    
                </p>
            </Link>
        </div>

        <div className="flex flex-col mt-5 mx-auto w-[87%] relative px-5 py-5 max-w-lg md:block lg:flex-row-reverse md:w-11/12 md:max-w-4xl 3xl:max-w-[clamp(1300px,80vw,1700px)] lg:max-w-6xl md:mt-0
        lg:flex md:items-stretch md:justify-evenly lg:max-h-[60vh] h-max 3xl:py-20 lg:py-12 md:py-10 md:px-10 lg:px-0">

            <div className="absolute -right-1/12 bottom-0 bg-[#2142AE] -skew-x-2 w-5/12 h-10/12 md:-right-[60px]"></div>
            <div className="absolute left-0 top-0 bg-white -skew-x-2 w-full h-full md:rounded-t-lg"></div>

            <div className="w-full mb-5 md:float-right lg:float-none relative md:w-5/12">
                <h2 className="text-[22px] text-center mb-4 md:hidden">A szolgáltatásról</h2>
                <div className="relative w-[90%] aspect-8/5 mt-8 ml-2">
                    <div className="w-6/12 h-full absolute -right-1/12 bottom-1/12 -skew-x-2 bg-main"></div>
                    <Image src={imageSource} alt={alt} fill className="object-cover [overflow-clip-margin:unset] rounded-lg" />
                </div>
            </div>
            
            <div className="relative lg:w-5/12">
                <h2 className="text-tablet-h2 text-left mb-4 hidden md:block xl:text-desktop-h2 3xl:text-desktop-h1">A szolgáltatásról</h2>
                <p className="text-left text-[14px] md:text-desktop-p 3xl:text-[21px]">{description}</p>
            </div>
        </div>

    </section>
}