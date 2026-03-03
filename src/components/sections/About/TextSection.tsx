import clsx from "clsx";
import { ReactNode } from "react";

export default function TextSection({children,id, className = '', standalone=false}:{children?:ReactNode,id?:string, className?: string, standalone?:boolean}){
    return <section className={clsx("w-full bg-white rounded-md py-7 px-5 md:px-8 lg:px-13 shadow-lg my-4", className, standalone && "max-w-7xl mx-auto")} id={id}>
        {children}
    </section>
}