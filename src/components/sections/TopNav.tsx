"use client"
import { Contact } from "@prisma/client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon, ChevronLeftIcon, ArrowRightIcon } from "@/icons";
import { useEffect } from "react";
import CTALink from "../ui/button/CTA";
import { formatOpeningHours } from "@/lib/dateUtils";

export default function TopNav({ contact }: { contact: Contact }) {
    const mainMenuRef = useRef<HTMLButtonElement>(null);
    const subMenuRef = useRef<HTMLButtonElement>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const subBlurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [open, setOpen] = useState(false);
    const [expandedMain, setExpandedMain] = useState(false);
    const [expandedSub, setExpandedSub] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const phone = "+36 20 5550 150";

    const opentimedisplay = formatOpeningHours(contact?.opens, contact?.closes, contact?.days);

    // track viewport size (md breakpoint) so we know whether to use hover/focus or toggle behavior
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleMainMenuToggle = () => {
        setExpandedMain(prev => !prev);
    };

    const handleSubMenuToggle = () => {
        setExpandedSub(prev => !prev);
    };

    const collapseAllSections = () => {
        if (!isDesktop) {
            setExpandedMain(false);
            setExpandedSub(false);
            setOpen(false);
        }
        // On desktop, don't collapse state - let hover handle it naturally
        // This prevents padding mismatch when menu is still visible via hover
        
        // Remove focus from any active element
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (
        <>
            <Link
                tabIndex={1}
                href="#hero-content"
                prefetch={false}
                className="sr-only focus:not-sr-only focus:z-[99999] focus:absolute focus:left-0 z-99999 bg-main border-2 border-black rounded-sm text-white px-3.5 py-5 focus:translate-x-0"
            >
                Ugrás a lényegre
            </Link>

            <div className="h-20 lg:h-[135px] w-full" />

            <header className="fixed top-0 left-0 w-full z-9999 bg-white shadow-lg shadow-black/10 max-w-[100vw]">
                {/* Top info bar - desktop only */}
                <div className="hidden md:flex h-10 bg-main px-14 gap-10 items-center text-white text-xs">
                    <Link
                        href={"mailto:" + (contact?.email ?? "")}
                        prefetch={false}
                        onClick={(e) => {
                            collapseAllSections();
                        }}
                        className="flex items-center gap-2 hover:opacity-90"
                    >
                        <Image src="/images/icons/email.svg" alt="" aria-hidden="true" width={16} height={12} />
                        <span className="sr-only">E-mail: </span>
                        <span>{contact?.email ?? "EMAIL HERE"}</span>
                    </Link>
                    <Link
                        href={"tel:" + phone.replace(" ", "")}
                        prefetch={false}
                        onClick={(e) => {
                            collapseAllSections();
                        }}
                        className="flex items-center gap-2 hover:opacity-90"
                    >
                        <Image src="/images/icons/phone.svg" alt="" aria-hidden="true" width={16} height={16} />
                        <span className="sr-only">Telefon: </span>
                        <span>{phone}</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Image src="/images/icons/clock.svg" alt="" aria-hidden="true" width={16} height={16} />
                        <span>{opentimedisplay}</span>
                    </div>
                </div>

                {/* Main navigation bar */}
                <nav className="flex md:flex-row items-center justify-between px-4 md:px-[2%] py-3 md:py-0 h-auto md:h-16 lg:h-24 max-w-[100vw]" aria-label="Főnavigáció">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3" title="Ugrás a főoldalra">
                        <Image
                            src={"/images/brand/logo.png"}
                            alt="Logo"
                            width={342}
                            height={342}
                            className="hidden md:block h-16 w-16 shrink-0"
                        />
                        <h2 className="text-lg hidden lg:block">Cool-Finish Kft.</h2>
                    </Link>

                    {/* Mobile header */}
                    <div className="flex md:hidden items-center justify-between w-full">
                        <Link href={"/"}>
                        <Image
                            src={"/images/brand/logo.png"}
                            alt="Logo"
                            width={342}
                            height={342}
                            className="h-14 w-14"
                        />
                        </Link>
                        <div className="flex gap-3 items-center">
                                <CTALink href="/kapcsolat" className="text-xs px-2! py-2 h-auto" hide_chevron onClick={(e) => {
                                collapseAllSections();
                            }}>
                                Kapcsolat
                            </CTALink>
                            <button
                                onClick={() => setOpen(p => {
                                    const next = !p;
                                    if (!next) {
                                        setExpandedMain(false);
                                        setExpandedSub(false);
                                    }
                                    return next;
                                })}
                                aria-label="Menü megnyitása"
                                className="p-1"
                            >
                                <Image src="/images/icons/bars.png" width={36} height={36} alt="Menü" />
                            </button>
                        </div>
                    </div>

                    {/* Main menu */}
                    <ul
                        className={`${open ? "flex" : "hidden"
                            } md:flex flex-col md:flex-row w-full md:w-auto absolute md:relative top-full left-0 md:top-auto 
                        md:left-auto bg-white md:bg-transparent md:mt-0 gap-0 md:gap-0 md:h-full [&_li]:border-t-2 md:[&_li]:border-t-0! [&_ul_li]:border-t-2 [&_ul_li]:first:border-t-0`}
                        role="menubar"
                        aria-label="Navigációs menü"
                    >
                        <li className="md:contents">
                            <Link
                                href="/"
                                onClick={(e) => {
                                    collapseAllSections();
                                }}
                                className="block md:inline-flex px-4 md:px-2 lg:px-2 xl:px-3 py-3 md:py-0 text-sm lg:text-lg focus-within:text-white font-bold text-dark hover:bg-main focus-within:bg-main hover:text-white   transition-colors md:h-full md:items-center"
                            >
                                Főoldal
                            </Link>
                        </li>

                        <li className="md:contents">
                            <Link
                                href="/rolunk"
                                onClick={(e) => {
                                    collapseAllSections();
                                }}
                                className="block md:inline-flex px-4 md:px-2 lg:px-2 xl:px-3 py-3 md:py-0 text-sm lg:text-lg focus-within:text-white font-bold text-dark hover:bg-main focus-within:bg-main hover:text-white   transition-colors md:h-full md:items-center"
                            >
                                Rólunk
                            </Link>
                        </li>

                        <li className="md:contents">
                            <Link
                                href="/referenciak"
                                onClick={(e) => {
                                    collapseAllSections();
                                }}
                                className="block md:inline-flex px-4 md:px-2 lg:px-2 xl:px-3 py-3 md:py-0 text-sm lg:text-lg focus-within:text-white font-bold text-dark hover:bg-main focus-within:bg-main hover:text-white   transition-colors md:h-full md:items-center"
                            >
                                Referenciák
                            </Link>
                        </li>

                        {/* Services dropdown */}
                        <li
                            role="none"
                            className="relative group md:h-full"
                            onFocus={() => {
                                if (isDesktop) setExpandedMain(true);
                            }}
                            onBlur={(e) => {
                                if (isDesktop && e.currentTarget) {
                                    const relatedTarget = e.relatedTarget as Node | null;
                                    // Check if focus moved outside the menu (null means tabbed out entirely, or not contained)
                                    const focusLeftMenu = !relatedTarget || !e.currentTarget.contains(relatedTarget);
                                    
                                    if (focusLeftMenu) {
                                        // Delay collapse to allow hover to keep it open
                                        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                                        blurTimeoutRef.current = setTimeout(() => {
                                            // Double-check: verify active element is not within menu and element is not hovered
                                            const activeElement = document.activeElement;
                                            const stillHasFocus = activeElement && e.currentTarget?.contains(activeElement as Node);
                                            const isHovered = e.currentTarget?.matches(':hover');
                                            
                                            if (!stillHasFocus && !isHovered) {
                                                setExpandedMain(false);
                                            }
                                        }, 100);
                                    }
                                }
                            }}
                            onMouseEnter={() => {
                                if (isDesktop) {
                                    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                                    setExpandedMain(true);
                                }
                            }}
                            onMouseLeave={() => {
                                if (isDesktop) {
                                    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                                    setExpandedMain(false);
                                }
                            }}
                        >
                            <button
                                ref={mainMenuRef}
                                type="button"
                                onClick={() => {
                                    // on mobile toggle behaviour; on desktop hover/focus controls expansion
                                    if (!isDesktop) {
                                        handleMainMenuToggle();
                                    }
                                }}
                                className="w-full md:w-auto flex items-center justify-between md:justify-center px-4 md:px-2 lg:px-2 xl:px-3 py-3 md:py-0 focus-within:text-white text-sm lg:text-lg font-bold text-dark hover:bg-main focus-within:bg-main hover:text-white  transition-colors md:h-full"
                                aria-haspopup="true"
                                aria-expanded={expandedMain}
                            >
                                <span className="flex items-center gap-1">
                                    Szolgáltatásaink
                                    <ChevronDownIcon aria-hidden="true" className={`w-4 h-4 transition-transform origin-center ${expandedMain ? 'rotate-180' : ''}`} />
                                </span>
                            </button>

                            <ul
                                role="menu"
                                className={`${expandedMain ? "[&_li_a]:pl-7 flex border-t-2 md:border-t-0! border-b-2 " : "hidden"
                                    } md:group-hover:flex md:group-hover:[&_li_a]:pl-7 md:group-focus-within:flex md:group-focus-within:[&_li_a]:pl-7 flex-col md:absolute md:left-0 md:top-full md:bg-white md:border md:border-gray-200 md:mt-0 md:min-w-[220px] md:z-20`}
                                aria-label="Szolgáltatások almenü"
                            >
                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/hoszivattyu"
                                        onClick={(e) => {
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
                                    >
                                        Hőszivattyúk
                                    </Link>
                                </li>

                                {/* Cooling technology submenu */}
                                <li
                                    role="none"
                                    className="relative group/cooling ml-0 pl-0!"
                                    onFocus={() => {
                                        if (isDesktop) setExpandedSub(true);
                                    }}
                                    onBlur={(e) => {
                                        if (isDesktop && e.currentTarget) {
                                            const relatedTarget = e.relatedTarget as Node | null;
                                            // Check if focus moved outside the menu (null means tabbed out entirely, or not contained)
                                            const focusLeftMenu = !relatedTarget || !e.currentTarget.contains(relatedTarget);
                                            
                                            if (focusLeftMenu) {
                                                // Delay collapse to allow hover to keep it open
                                                if (subBlurTimeoutRef.current) clearTimeout(subBlurTimeoutRef.current);
                                                subBlurTimeoutRef.current = setTimeout(() => {
                                                    // Double-check: verify active element is not within menu and element is not hovered
                                                    const activeElement = document.activeElement;
                                                    const stillHasFocus = activeElement && e.currentTarget?.contains(activeElement as Node);
                                                    const isHovered = e.currentTarget?.matches(':hover');
                                                    
                                                    if (!stillHasFocus && !isHovered) {
                                                        setExpandedSub(false);
                                                    }
                                                }, 100);
                                            }
                                        }
                                    }}
                                    onMouseEnter={() => {
                                        if (isDesktop) {
                                            if (subBlurTimeoutRef.current) clearTimeout(subBlurTimeoutRef.current);
                                            setExpandedSub(true);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (isDesktop) {
                                            if (subBlurTimeoutRef.current) clearTimeout(subBlurTimeoutRef.current);
                                            setExpandedSub(false);
                                        }
                                    }}
                                >
                                    <button
                                        ref={subMenuRef}
                                        type="button"
                                        onClick={() => {
                                            if (!isDesktop) {
                                                handleSubMenuToggle();
                                            }
                                        }}
                                        className="w-full flex items-center justify-between px-4 pl-7 py-3 text-sm font-bold text-dark hover:bg-main focus-within:text-white focus-within:bg-main hover:text-white transition-colors"
                                        aria-haspopup="true"
                                        aria-expanded={expandedSub && expandedMain}
                                    >
                                        <span className="flex items-center gap-1 flex-row-reverse md:flex-row">
                                            {isDesktop ? (
                                                <ChevronLeftIcon aria-hidden="true" className="w-4 h-4" />
                                            ) : (
                                                <ChevronDownIcon aria-hidden="true" className={`w-4 h-4 transition-transform origin-center ${expandedSub ? 'rotate-180' : ''}`} />
                                            )}
                                            <span>Hűtéstechnika</span>
                                        </span>
                                    </button>

                                    <ul
                                        role="menu"
                                        className={`${expandedSub ? "flex [&_li_a]:pl-12 border-t-4 border-b-4 " : "hidden"
                                            } md:group-hover/cooling:flex md:group-hover/cooling:[&_li_a]:pl-12 md:group-focus-within/cooling:flex md:group-focus-within/cooling:[&_li_a]:pl-12 flex-col md:absolute md:right-full md:top-0 md:bg-white md:border md:border-gray-200 md:min-w-[220px] md:z-20 md:mr-0`}
                                        aria-label="Hűtéstechnikai szolgáltatások"
                                    >
                                        <li role="none">
                                            <Link
                                                href="/szolgaltatasok/hutestechnika/lakossagi-klimaszereles"
                                                onClick={(e) => {
                                                    collapseAllSections();
                                                }}
                                                className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main hover:text-white transition-colors focus-within:text-white"
                                            >
                                                Lakossági Klímaszerelés
                                            </Link>
                                        </li>
                                        <li role="none">
                                            <Link
                                                href="/szolgaltatasok/hutestechnika/ipari-gepek"
                                                onClick={(e) => {
                                                    collapseAllSections();
                                                }}
                                                className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main hover:text-white transition-colors focus-within:text-white"
                                            >
                                                Ipari Gépek
                                            </Link>
                                        </li>
                                        <li role="none">
                                            <Link
                                                href="/szolgaltatasok/hutestechnika/legtechnika"
                                                onClick={(e) => {
                                                    collapseAllSections();
                                                }}
                                                className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
                                            >
                                                Légtechnika
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/javitas-karbantartas"
                                        onClick={(e) => {
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
                                    >
                                        Javítás & Karbantartás
                                    </Link>
                                </li>
                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/kereskedelmi-hutok"
                                        onClick={(e) => {
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main hover:text-white focus-within:text-white focus-within:bg-main transition-colors"
                                    >
                                        Kereskedelmi Hűtők
                                    </Link>
                                </li>
                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/vizsgalatok-dokumentacio"
                                        onClick={(e) => {
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
                                    >
                                        Vizsgálatok & Dokumentáció
                                    </Link>
                                </li>
                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/VRV"
                                        onClick={(e) => {
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-bold text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
                                    >
                                        VRV klímaszerelés
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="md:contents">
                            <Link
                                href="/gyik"
                                onClick={(e) => {
                                    collapseAllSections();
                                }}
                                className="block md:inline-flex px-4 md:px-2 lg:px-2 xl:px-3 py-3 md:py-0 text-sm lg:text-lg font-bold text-dark hover:bg-main focus-within:text-white focus-within:bg-main hover:text-white transition-colors md:h-full md:items-center"
                            >
                                GYIK
                            </Link>
                        </li>

                        <li className="md:contents">
                            <div className="px-2 md:px-0 md:ml-3 py-3 md:py-0 md:h-full md:flex md:items-center">
                                <CTALink href="/kapcsolat" onClick={(e) => {
                                    collapseAllSections();
                                }}>Kapcsolat</CTALink>
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}