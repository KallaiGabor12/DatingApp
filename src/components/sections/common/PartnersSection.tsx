"use client"
import Image from "next/image"
export default function PartnersSection() {
    return <>
        <section className="w-full  mx-auto py-10 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 mx-auto sm:grid-rows-2 relative gap-x-14 gap-y-5 max-w-6xl">
                <div className="w-full self-center">
                    <h2 className="text-[33px]/[1.1] text-dark text-center md:text-left">Zöld technológia, a fenntartható jövőért</h2>
                    <p className="text-desktop-p text-dark mt-2 text-center md:text-left">Kiemelkedő minőséget nyújtunk azáltal, hogy minden munkánk során kizárólag energiahatékony berendezésekkel dolgozunk.</p>
                </div>
                <div></div>

                <Image src="/images/logo/GREE.png" alt="GREE" title="A GREE logója" width={3656} height={968} className="w-9/12 sm:w-7/12 sm:my-1 mx-auto md:w-full self-center justify-self-center  origin-center scale-85" />
                <Image src="/images/logo/DAIKIN.png" alt="DAIKIN" title="A DAIKIN logója" width={450} height={94} className="w-9/12 sm:w-7/12 sm:my-1 mx-auto md:w-full self-center" />
                <Image src="/images/logo/KAISAI.webp" alt="KAISAI" title="A KAISAI logója" width={930} height={180} className="w-9/12 sm:w-7/12 sm:my-1 mx-auto md:w-full self-center justify-self-center origin-center scale-[77%] -translate-y-[8%]" />
                <Image src="/images/logo/hobagoly.png" alt="Hóbagoly" title="A Hóbagoly logója" width={930} height={180} className="w-9/12 sm:w-7/12 sm:my-1 mx-auto md:w-full self-center justify-self-center origin-center scale-[77%] -translate-y-[8%]" />
            </div>
        </section>
    </>
}