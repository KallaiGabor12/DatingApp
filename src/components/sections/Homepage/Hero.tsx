"use client"

import CTALink from "@/components/ui/button/CTA";
import Image from "next/image"
import Link from "next/link";

export default function Hero() {
    return (
        <section id="hero-content" className="flex flex-col-reverse md:flex-row justify-center! items-start md:items-center relative md:h-[calc(100vh-80px)] lg:h-[calc(100vh-135px)] 
         gap-7 md:gap-10 lg:gap-15 
         px-[min(30px,5vw)] md:px-[min(15px,3vw)]
         py-5 md:py-0 box-border">
            <div className="bg-main w-1/12 sm:w-4/12 h-full absolute bottom-0 right-0 z-0"></div>
            <div className="z-1 flex sm:block md:flex sm:max-w-full flex-col gap-1 sm:gap-2 md:w-[59%] w-full sm:w-full md:max-w-max">
                {/* <Image src="/images/pages/home/hero-decor.svg" alt="" width={79} height={33}  className="hidden md:block w-16 md:w-20"/> */}
                <div className="z-1 w-6/12 hidden sm:block md:hidden float-right ml-3.5 my-auto">
                    <Image src="/images/pages/home/hero2.png" alt="" width={619} height={384} fetchPriority="high"
                        className="rounded-[20px] w-full md:shadow-[-10px_10px_35px_0_#0003] shadow-[0_10px_35px_0_#0003]" />
                </div>
                <p className="text-secondary text-mobile-h2 md:text-xl lg:text-2xl font-semibold">Hűtés-fűtés egész évben</p>
                <h1 className="text-dark text-mobile-h1/tight sm:my-0 my-1 md:text-tablet-h1/tight lg:text-desktop-h1/[1.2]">Komplex hűtés- és <br/> klíma&shy;szolgáltatás</h1>
                <p className="text-default text-desktop-p md:mb-10 mb-3 sm:mb-6 sm:mt-3 md:mt-0">Legyen szó új, lakossági vagy ipari klímaberendezés <br /> telepítéséről, karbantartásáról vagy hibaelhárításról</p>
                <div className="flex sm:flex-row w-12/12 gap-2 sm:gap-8 items-center sm:items-center md:justify-start justify-start flex-wrap">
                    <CTALink href="/kapcsolat#contact-section">Kapcsolat</CTALink>
                    <Link href="#szolgaltatasok" className="text-secondary text-[12px] md:text-[14px] 
                    uppercase flex items-center justify-start gap-1 sm:gap-2.5 font-bold hover:underline decoration-2 group">
                        <Image src="/images/icons/circle-play.svg" width={32} height={32} alt="" aria-hidden="true"
                        className="group-hover:translate-x-1 group-focus-within:translate-x-1 duration-200"/>
                        <span>Szolgáltatások</span>
                    </Link>
                </div>
            </div>
            <div className="z-1 w-full md:max-w-[37%] block sm:hidden md:block">
                <Image src="/images/pages/home/hero2.png" alt="" width={619} height={384}
                    className="rounded-[20px] w-full md:shadow-[-10px_10px_35px_0_#0003] shadow-[0_10px_35px_0_#0003]" />
            </div>
        </section>
    )
}