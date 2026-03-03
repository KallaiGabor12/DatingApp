import Image from "next/image"
export default function TeamSection({darken=false}:{darken?:boolean}) {
    return <section className={`w-full px-7 md:px-11 max-w-7xl mx-auto my-12 mt-16 ${darken ? "bg-main" : "bg-transparent"}`}>
        <p className={`${darken ? "text-dark-blue" : "text-secondary"} text-mobile-h2 md:text-xl font-bold`}>A Cool-Finish Kft. csapata</p>
        <h2 className="text-desktop-h2 my-2">Ismerje meg csapatunkat!</h2>

        <div className="relative w-full h-[40vw] max-h-[400px] overflow-hidden my-5 rounded-md">
            <Image src="/images/components/team.png" alt="" role="presentation" width={1260} height={870}
                className="w-full absolute top-7/12 left-0 -translate-y-6/12" />
        </div>
        <ul className={`grid grid-cols-2 md:grid-cols-4 lg:flex justify-between imtes-start [&>li]:gap-2 [&>li]:grid [&>li]:max-w-52 lg:[&>li]:max-w-10/12 [&>li]:my-3.5
        md:[&_img]:w-52 lg:[&_img]:w-full gap-x-8 [&>li]:hover:bg-white ${darken ? "[&>li:hover_p]:text-default!" : ""} [&>li]:p-2 [&>li]:duration-200 [&>li]:rounded-lg [&>li]:hover:scale-105 [&>li]:shadow-[#000a] [&>li]:hover:shadow-2xl`}>
            <li>
                <Image src={"/images/components/member1.png"} alt="" role="presentation" width={200} height={160} className="rounded-md"/>
                <p className={`${darken ? "text-dark-blue" : "text-secondary"} font-bold text-[14px] sm:text-desktop-p`}>Csapattag Neve</p>
                <p className={`text-[12px] md:text-desktop-p ${darken ? "text-white" : "text-default"}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, sequi.</p>
            </li>
            <li>
                <Image src={"/images/components/member2.png"} alt="" role="presentation" width={200} height={160} className="rounded-md"/>
                <p className={`${darken ? "text-dark-blue" : "text-secondary"} font-bold text-[14px] sm:text-desktop-p`}>Csapattag Neve</p>
                <p className={`text-[12px] md:text-desktop-p ${darken ? "text-white" : "text-default"}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, sequi.</p>
            </li>
            <li>
                <Image src={"/images/components/member3.png"} alt="" role="presentation" width={200} height={160} className="rounded-md"/>
                <p className={`${darken ? "text-dark-blue" : "text-secondary"} font-bold text-[14px] sm:text-desktop-p`}>Csapattag Neve</p>
                <p className={`text-[12px] md:text-desktop-p ${darken ? "text-white" : "text-default"}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, sequi.</p>
            </li>
            <li>
                <Image src={"/images/components/member4.png"} alt="" role="presentation" width={200} height={160} className="rounded-md"/>
                <p className={`${darken ? "text-dark-blue" : "text-secondary"} font-bold text-[14px] sm:text-desktop-p`}>Csapattag Neve</p>
                <p className={`text-[12px] md:text-desktop-p ${darken ? "text-white" : "text-default"}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, sequi.</p>
            </li>
        </ul>
    </section>
}