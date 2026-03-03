"use client"
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function CTALink({ children, href, className, hide_chevron = false, onClick, ...rest }: { children: ReactNode, href: string, onClick?: (e:any) => void, hide_chevron?: boolean, className?: string }) {
    return (
        <Link className={clsx(
            `bg-main px-5 py-3 lg:px-5 lg:py-4 flex w-max gap-2.5 
            rounded-md text-white uppercase 
            font-bold text-[14px] items-center justify-center place-items-center
            hover:shadow-xl focus:shadow-xl hover:scale-105 hover:-translate-y-0.5 focus:scale-105 focus:-translate-y-0.5
            shadow-black/30 duration-200`
            , className
        )} href={href} {...rest} onClick={(e)=>{onClick ? onClick(e) : ()=>{}}}>
            <span>{children}</span><Image src="/images/icons/chevron-right.svg" alt='' aria-hidden="true" width={14} height={14} className={hide_chevron ? "hidden" : ""}/>
        </Link>
    )
}