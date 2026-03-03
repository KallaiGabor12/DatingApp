import Image from "next/image";
import Link from "next/link";

export default function ServicesSection({id}:{id?:string}) {
    return <section className="max-w-7xl mx-auto w-11/12 sm:w-10/12 lg:w-11/12" id={id}>
        <h2 className="text-desktop-h2 text-dark text-center mb-12">Szolgáltatásaink</h2>
        <ul className="sm:grid gap-y-4 items-stretch justify-center mx-auto gap-x-0
        [&_a]:text-main [&_a]:hover:underline decoration-2 [&_a]:flex [&_a]:items-center [&_a]:my-1 [&_a]:gap-1 [&_a_img]:w-2.5 [&_a]:w-min
        [&_h3]:font-semibold [&_h3]:my-4 [&_h3]:text-[20px]
        [&_p]:text-default [&_p]:w-11/12 [&_p]:text-[14px]
        [&_article]:h-full [&_article]:flex [&_article]:flex-col [&_article]:w-full [&_article]:justify-start
        [&_div]:flex [&_div]:h-full [&_div]:flex-col [&_article>div]:jusitfy-between [&_article>div]:px-3 [&_article>div]:py-2
        [&_div]:w-full
        [&_li]:hover:bg-white [&_li]:hover:shadow-2xl sm:[&_li]:shadow-[#000a] [&_li]:rounded-2xl [&_li]:hover:scale-105 [&_li]:duration-200
        [&_li]:focus-within:bg-white [&_li]:focus-within:shadow-2xl [&_li]:focus-within:scale-105
        flex flex-col w-10/12 sm:w-full
        sm:[grid-template-areas:'a_a_b_b'_'c_c_d_d'_'e_e_f_f']
        lg:gap-y-10
        lg:[grid-template-areas:'a_a_a_a_b_b_b_b'_'c_c_d_d_e_e_f_f']
        sm:gap-5 lg:gap-x-2
        
        auto-rows-[1fr] grid-rows-subgrid">
            <li className="" style={{ gridArea: "a" }}>
                <article>
                    <div>
                        <div>
                            <Image src="/images/components/vrv.jpeg" alt="VRV klímatelepítés szolgáltatás" title="VRV klíma kültéri egysége" width={400} height={300} className="w-full rounded-xl" />
                            <h3>VRV klímatelepítés</h3>
                            <p>A kültéri egység kis helyet igényel, halk, és könnyen illeszthető a homlokzathoz vagy udvarhoz. Energiatakarékos, szinte észrevétlenül válik a mindennapok részévé.</p>
                        </div>
                        <Link href={"/szolgaltatasok/VRV"} title="Ugrás a szolgáltatásra (VRV Klímatelepítés)">Megnézem <Image src="/images/icons/arrow.png" alt="->" width={16} height={16} /></Link>
                    </div>
                </article>
            </li>
            <li className="" style={{ gridArea: "b" }}>
                <article>
                    <div>
                        <div>
                            <Image src="/images/components/iparigepek.jpg" alt="" role="presentation" width={400} height={300}  className="w-full rounded-xl"/>
                            <h3>Ipari gépek</h3>
                            <p>Az ipari hűtőegységek megbízható megoldást nyújtanak technológiai folyamatok hűtésére, biztosítva az állandó hőmérsékletet, energiahatékonyságot, hosszú élettartamot és üzembiztos működést különböző iparágakban.</p>
                        </div>
                        <Link href={"/szolgaltatasok/hutestechnika/ipari-gepek"} title="Ugrás a szolgáltatásra (Ipari gépek)" >Megnézem <Image src="/images/icons/arrow.png" alt="->" width={16} height={16} /></Link>
                    </div>
                </article>
            </li>
            <li className="lg:max-h-[400px]" style={{ gridArea: "c" }}>
                <article>
                    <div>
                        <div className="h-min">
                            <Image src="/images/components/cooler.jpg" alt="Kereskedelmi hűtők szolgáltatás" title="Egy kereskedelmi hűtősor" width={400} height={300} className="rounded-lg"/>
                            <h3>Kereskedelmi hűtők</h3>
                            <p>Tapasztalt szakembereink precízen, tisztán és hatékonyan dolgoznak. A telepítés nemcsak szakszerű, hanem tartós és esztétikus is – nálunk a minőség nem extra, hanem alap.</p>
                        </div>
                        <Link href={"/szolgaltatasok/kereskedelmi-hutok"} title="Ugrás a szolgáltatásra (Kereskedelmi hűtők)">Megnézem <Image src="/images/icons/arrow.png" alt="->" width={16} height={16} /></Link>
                    </div>
                </article>
            </li>
            <li className="lg:max-h-[400px]" style={{ gridArea: "d" }}>
                <article>
                    <div>
                        <div>
                            <Image src="/images/components/cleaning.png" alt="Karbantartás és javítás szolgáltatás" title="Kollégánk tisztít egy klímát" width={400} height={300} className="rounded-lg" />
                            <h3>Karbantartás és javítás</h3>
                            <p>Az ügyfeleink egészsége és a berendezés üzembiztos működése fontos számunkra. A berendezés meghibásodása esetén szervizes szakembereink állnak rendelkezésre.</p>
                        </div>
                        <Link href={"/szolgaltatasok/javitas-karbantartas"} title="Ugrás a szolgáltatásra (Karbantartás és javítás)">Megnézem <Image src="/images/icons/arrow.png" alt="->" width={16} height={16} /></Link>
                    </div>
                </article>
            </li>
            <li className="lg:max-h-[400px]" style={{ gridArea: "e" }}>
                <article>
                    <div>
                        <div>
                            <Image src="/images/components/hoszivattyu.png" alt="Hőszivattyúk szolgáltatás" title="Levegős hőszivattyú kültéri egysége" width={400} height={300} className="rounded-lg" />
                            <h3>Hőszivattyúk</h3>
                            <p>Hűtés, fűtés, HMV megoldások, osztott vagy monoblokkos rendszerek kivitelezése.</p>
                        </div>
                        <Link href={"/szolgaltatasok/hoszivattyu"} title="Ugrás a szolgáltatásra (Hőszivattyú)">Megnézem <Image src="/images/icons/arrow.png" alt="->" width={16} height={16} /></Link>
                    </div>
                </article>
            </li>
            <li className="lg:max-h-[400px]" style={{ gridArea: "f" }}>
                <article>
                    <div>
                        <div>
                            <Image src="/images/components/legtechnika.png" alt="Légtechnika szolgáltatás" title="Légtechnikai csőrendszer" className="rounded-lg" width={400} height={300} />
                            <h3>Légtechnika</h3>
                            <p>Légtechnika és szellőző berendezések kivitelezése, légkezelő egységek telepítése és karbantartása.</p>
                        </div>
                        <Link href={"/szolgaltatasok/hutestechnika/legtechnika"} title="Ugrás a szolgáltatásra (Hűtéstechnika/Légtechnika)">Megnézem <Image src="/images/icons/arrow.png" alt="->" width={16} height={16} /></Link>
                    </div>
                </article>
            </li>
        </ul>
    </section>
}