import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"

export default function ExperinceSection() {
    const TextSection = ({ full = false }) => (
        <div className={`${full ? "w-full" : "w-11/12 sm:w-full mx-auto sm:px-5"} my-5`}>
            <h2 className="text-[28px]/[1.1] sm:text-[35px] lg:text-desktop-h2/[1.1] font-semibold! mb-5 2xl:text-[55px]/[1.1]">Tapasztalat <br /><span className="text-main">&</span> megbízhatóság</h2>
            <p className="text-default 2xl:text-[20px]">Több mint 15 éves tapasztalattal, stabil pénzügyi háttérrel és bizonyított szakmai kompetenciával biztosítjuk ügyfeleink elégedettségét.</p>
        </div>
    )

    return <>
        <section className="w-full mb-10 lg:hidden max-w-2xl mx-auto" >
            <div className="flex items-stretch w-full jusitfy-center sm:gap-x-3 sm:px-5">
                <div className="w-6/12 bg-linear-to-t from-main/80 to-main/20 flex items-end justify-start sm:bg-none">
                    <div className="relative aspect-5/9 sm:aspect-5/7 w-11/12 mb-1.5 sm:mb-0">
                        <div className="hidden sm:block bg-linear-to-t from-main/80 to-main/20 w-12/12 h-full absolute right-3/12 bottom-1/12"></div>
                        <Image src={"/images/components/exp.png"} fill alt="" role="presentation" className="rounded-tr-xl sm:rounded-xl object-cover object-top [clip-margin-overflow:unset]" />
                    </div>
                </div>
                <div className="w-6/12 mb-3">
                    <h3 className="w-full pt-5 mb-3 text-[24px] sm:text-[35px] gap-1 flex font-semibold items-center justify-center flex-nowrap"><Image src={"/images/icons/wrench.svg"} alt="" role="presentation" width={32} height={32} /> Tapasztalat</h3>
                    <ul className="bg-[#d8f4ce] px-2.5 w-full rounded-sm py-3 [&>li]:text-[11px] sm:[&>li]:text-[16px] [&>li]:flex [&>li]:items-center [&>li]:gap-1 [&>li]:py-0.5 [&>li]:font-medium">
                        <li><Image src={"/images/icons/arrow-right-circle-main.svg"} width={24} height={24} alt="" role="presentation" /> képzett munkatársak</li>
                        <li><Image src={"/images/icons/arrow-right-circle-main.svg"} width={24} height={24} alt="" role="presentation" /> szakértő kivitelezés</li>
                        <li><Image src={"/images/icons/arrow-right-circle-main.svg"} width={24} height={24} alt="" role="presentation" /> garancia</li>
                    </ul>
                    <strong className="font-normal w-full flex flex-col items-center justify-center mt-10 mb-10 sm:scale-110">
                        <div className="flex flex-col items-start justify-center">
                            <span className="text-tablet-h1/[1] font-semibold">15+</span>
                            <span className="text-tablet-[24px]/[1.2] font-medium">év</span>
                        </div>
                    </strong>
                    <Link href="/rolunk" className="text-main hover:underline ml-4 text-[13px] sm:text-[16px]">Rólunk &rarr;</Link>
                </div>
            </div>
            <TextSection />
        </section>

        <section className="w-full my-24 hidden lg:block max-w-7xl mx-auto " >
            <div className="w-11/12 2xl:w-full flex justify-evenly items-stretch mx-auto">
                <div className="flex flex-col w-5/12 2xl:w-6/12">
                    <TextSection full />
                    <div>
                        <h3 className="w-full pt-5 mb-3 text-[20px] 2xl:text-tablet-h2 gap-1 flex font-semibold justify-start flex-nowrap relative">
                            <div className="ml-[7px] relative">
                                <div className="absolute bg-main w-0.5 h-6 top-5 left-1/2 -translate-x-1/2 2xl:h-[30px]"></div>
                                <Image src={"/images/icons/wrench.svg"} alt="" role="presentation" width={32} height={32} className="relative" /> 
                            </div> Tapasztalat
                        </h3>
                        <div className="flex justify-start gap-x-5 2xl:mb-5">
                            <ul className="bg-[#d8f4ce] px-2.5 h-min w-full rounded-sm py-3 [&>li]:text-[16px] 2xl:[&>li]:text-[20px] [&>li]:flex [&>li]:items-center [&>li]:gap-1 [&>li]:py-1 [&>li]:font-medium">
                                <li><Image src={"/images/icons/arrow-right-circle-main.svg"} width={24} height={24} alt="nyíl" /> képzett munkatársak</li>
                                <li><Image src={"/images/icons/arrow-right-circle-main.svg"} width={24} height={24} alt="nyíl" /> szakértő kivitelezés</li>
                                <li><Image src={"/images/icons/arrow-right-circle-main.svg"} width={24} height={24} alt="nyíl" /> garancia</li>
                            </ul>
                            <strong className="font-normal w-full flex flex-col items-start justify-center mt-10 mb-10">
                                <div className="flex flex-col items-start justify-center">
                                    <span className="text-tablet-h1/[1] 2xl:text-tablet-[52px]/[1] font-semibold">15+</span>
                                    <span className="text-tablet-[24px]/[1.2] 2xl:text-tablet-[27px]/[1.2] font-medium">év</span>
                                </div>
                            </strong>
                        </div>
                        <Link href="/rolunk" className="text-main hover:underline text-[16px] 2xl:text-[20px]">Rólunk &rarr;</Link>
                    </div>
                </div>
                <div className="w-3/12 flex items-end justify-start 2xl:w-4/12">
                    <div className="relative aspect-5/9 w-full mb-1.5">
                        <div className="bg-linear-to-t from-main/80 to-main/20 w-12/12 h-full absolute left-3/12 bottom-1/12"></div>
                        <Image src={"/images/components/exp.png"} fill alt="Egy kép kollégánkról munka közben" title="munka közben..." className="rounded-xl object-cover [clip-margin-overflow:unset]" />
                    </div>
                </div>

            </div>
        </section>
    </>
}