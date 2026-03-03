"use client"
import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from "@/icons";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export default function Footer() {
    const mainMenuRef = useRef<HTMLButtonElement>(null);
    const subMenuRef = useRef<HTMLButtonElement>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const subBlurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [open, setOpen] = useState(true);
    const [expandedMain, setExpandedMain] = useState(false);
    const [expandedSub, setExpandedSub] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

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
        }
        // On desktop, don't collapse state - let hover handle it naturally
        // This prevents padding mismatch when menu is still visible via hover
        
        // Remove focus from any active element
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (<footer className="w-full bg-dark z-9999 px-[min(3vw,70px)] py-10 lg:py-14 pt-6 md:pt-0!">
        <nav className="flex flex-col md:flex-row items-center justify-between px-4 md:px-[2%] py-3 md:py-0 h-auto md:h-16 lg:h-24 max-w-[100vw]" aria-label="Főnavigáció">

            <h2 className="text-white font-semibold md:font-bold">Cool-Finish</h2>

            {/* Main menu */}
            <ul
                className={`${open ? "flex" : "hidden"
                    } md:flex flex-col md:flex-row w-full md:w-auto 
                        md:left-auto bg-dark md:bg-transparent md:mt-0 gap-0 md:gap-0 md:h-full [&_li]:border-t-2 [&_ul_li]:border-t-2 [&_ul_li]:first:border-t-0`}
                role="menubar"
                aria-label="Navigációs menü"
            >
                <li className="md:contents border-t-0!">
                    <Link
                        href="/"
                        onClick={(e) => {
                            collapseAllSections();
                        }}
                        className="block md:inline-flex px-4 md:px-3 lg:px-4 py-3 md:py-0 text-sm border-t-0! lg:text-lg focus-within:text-white font-semibold md:font-bold text-white hover:bg-main focus-within:bg-main hover:text-white   transition-colors md:h-full md:items-center"
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
                        className="block md:inline-flex px-4 md:px-3 lg:px-4 py-3 md:py-0 text-sm lg:text-lg focus-within:text-white font-semibold md:font-bold text-white hover:bg-main focus-within:bg-main hover:text-white   transition-colors md:h-full md:items-center"
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
                        className="block md:inline-flex px-4 md:px-3 lg:px-4 py-3 md:py-0 text-sm lg:text-lg focus-within:text-white font-semibold md:font-bold text-white hover:bg-main focus-within:bg-main hover:text-white   transition-colors md:h-full md:items-center"
                    >
                        Referenciák
                    </Link>
                </li>

                {/* Services dropdown */}
                <li
                    role="none"
                    className="relative group md:h-full md:border-t-0!"
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
                        className="w-full md:w-auto flex items-center justify-between md:justify-center px-4 md:px-3 lg:px-4 py-3 md:py-0 focus-within:text-white text-sm lg:text-lg font-semibold md:font-bold text-white hover:bg-main focus-within:bg-main hover:text-white  transition-colors md:h-full"
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
                        className={`${expandedMain ? "flex [&_li_a]:pl-7 border-t-2 md:border-t-0 border-b-2 " : "hidden"
                            } md:group-hover:flex md:group-hover:[&_li_a]:pl-7 md:group-focus-within:flex md:group-focus-within:[&_li_a]:pl-7 flex-col md:absolute md:left-0 md:bottom-full md:bg-white md:border md:border-gray-200 md:mt-0 md:min-w-[220px] md:z-20`}
                        aria-label="Szolgáltatások almenü"
                    >
                        <li role="none">
                            <Link
                                href="/szolgaltatasok/hoszivattyu"
                                onClick={(e) => {
                                    collapseAllSections();
                                }}
                                className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
                            >
                                Hőszivattyúk
                            </Link>
                        </li>

                        {/* Cooling technology submenu */}
                        <li
                            role="none"
                            className="relative group/cooling"
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
                                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:text-white focus-within:bg-main hover:text-white transition-colors"
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
                                            if (!isDesktop) {
                                                e.currentTarget.blur();
                                            }
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main hover:text-white transition-colors focus-within:text-white"
                                    >
                                        Lakossági Klímaszerelés
                                    </Link>
                                </li>
                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/hutestechnika/ipari-gepek"
                                        onClick={(e) => {
                                            if (!isDesktop) {
                                                e.currentTarget.blur();
                                            }
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main hover:text-white transition-colors focus-within:text-white"
                                    >
                                        Ipari Gépek
                                    </Link>
                                </li>
                                <li role="none">
                                    <Link
                                        href="/szolgaltatasok/hutestechnika/legtechnika"
                                        onClick={(e) => {
                                            if (!isDesktop) {
                                                e.currentTarget.blur();
                                            }
                                            collapseAllSections();
                                        }}
                                        className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
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
                                className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
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
                                className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main hover:text-white focus-within:text-white focus-within:bg-main transition-colors"
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
                                className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
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
                                className="block px-4 py-3 text-sm font-semibold text-white md:text-dark hover:bg-main focus-within:bg-main focus-within:text-white hover:text-white transition-colors"
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
                        className="block md:inline-flex px-4 md:px-3 lg:px-4 py-3 md:py-0 text-sm lg:text-lg font-semibold md:font-bold text-white hover:bg-main focus-within:text-white focus-within:bg-main hover:text-white transition-colors md:h-full md:items-center"
                    >
                        GYIK
                    </Link>
                </li>

                <li className="md:contents">
                    <Link
                        href="/kapcsolat"
                        onClick={(e) => {
                            collapseAllSections();
                        }}
                        className="block md:inline-flex px-4 md:px-3 lg:px-4 py-3 md:py-0 text-sm lg:text-lg font-semibold md:font-bold text-white hover:bg-main focus-within:text-white focus-within:bg-main hover:text-white transition-colors md:h-full md:items-center"
                    >
                        Kapcsolat
                    </Link>
                </li>
            </ul>
        </nav>
        <hr className="border-white" role="presentation" />
        <div className="flex md:flex-row flex-col justify-evenly md:justify-between items-center h-16 lg:h-20 w-full">
            <p className="text-white text-[12px] lg:text-sm mx-auto md:mx-0 w-max">&copy; Cool-Finish Kft. - Minden jog fenntartva!</p>
            <div className="flex gap-7">
                <Link href="/privacy-policy" prefetch={false} onClick={(e) => {
                    e.currentTarget.blur();
                    collapseAllSections();
                }} className="text-secondary text-[12px] lg:text-sm font-semibold text-center mx-auto md:mx-0">Adatvédelmi tájékoztató</Link>
                <Link href="/impresszum" prefetch={false} onClick={(e) => {
                    e.currentTarget.blur();
                    collapseAllSections();
                }} className="text-secondary text-[12px] lg:text-sm font-semibold text-center mx-auto md:mx-0">Impresszum</Link>
            </div>
        </div>
        <hr className="border-white" role="presentation" />

    </footer>)
}