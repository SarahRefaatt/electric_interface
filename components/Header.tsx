


"use client";

import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

const logos = [
    "/logo/logo1.jpg",
    "/logo/logo2.jpg",
    "/logo/logo3.jpg",
];

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [logo, setLogo] = useState(logos[0]);

    useEffect(() => {
        let lastIndex = 0;

        const shuffle = () => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * logos.length);
            } while (nextIndex === lastIndex);

            lastIndex = nextIndex;
            setLogo(logos[nextIndex]);
        };

        const interval = setInterval(shuffle, 30); // 🔥 VERY FAST

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-[1000] pt-[2.4rem] px-[4rem] flex justify-between items-start pointer-events-none text-dark dark:text-light transition-colors duration-500">

            {/* Logo */}
            <div className="absolute left-1/2 top-[2.7rem] -translate-x-1/2 w-[10rem] pointer-events-auto">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-auto object-contain select-none"
                    draggable={false}
                />
            </div>

            {/* Nav */}
            <nav className="pointer-events-auto flex flex-col gap-[1rem]">
                {/* About */}
                <a href="#about" className="group relative flex items-center gap-[1.8rem]">
                    <div className="absolute left-0 bottom-0 h-[1.2px] bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 w-full"></div>
                    <div className="relative w-[2.2rem] h-[2.2rem] flex items-center justify-center">
                        <div className="absolute w-full h-full border border-current/40 rounded-full"></div>
                        <div className="w-[0.5rem] h-[0.5rem] bg-current rounded-full transition-all duration-300 group-hover:translate-x-[0.25rem] group-hover:translate-y-[-0.15rem]"></div>
                    </div>
                    <span className="font-mono text-[1.7rem] group-hover:translate-x-2 transition-transform duration-300">
                        About us
                    </span>
                </a>

                {/* Contacts */}
                <a href="#contacts" className="group relative flex items-center gap-[1.8rem]">
                    <div className="absolute left-0 bottom-0 h-[1.2px] bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 w-full"></div>
                    <div className="relative w-[2.2rem] h-[2.2rem] flex items-center justify-center">
                        <div className="absolute w-full h-full border border-current/40 rounded-full"></div>
                        <div className="w-[0.5rem] h-[0.5rem] bg-current rounded-full transition-all duration-300 group-hover:translate-x-[0.25rem] group-hover:translate-y-[0.15rem]"></div>
                    </div>
                    <span className="font-mono text-[1.7rem] group-hover:translate-x-2 transition-transform duration-300">
                        Contacts
                    </span>
                </a>

                {/* FAQ */}
                <a href="#faq" className="group relative flex items-center gap-[1.8rem]">
                    <div className="absolute left-0 bottom-0 h-[1.2px] bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 w-full"></div>
                    <div className="relative w-[2.2rem] h-[2.2rem] flex items-center justify-center">
                        <div className="absolute w-full h-full border border-current/40 rounded-full"></div>
                        <div className="w-[0.5rem] h-[0.5rem] bg-current rounded-full transition-all duration-300 group-hover:translate-x-[-0.25rem] group-hover:translate-y-[0.15rem]"></div>
                    </div>
                    <span className="font-mono text-[1.7rem] group-hover:translate-x-2 transition-transform duration-300">
                        FAQ
                    </span>
                </a>
            </nav>

            {/* Theme */}
            {/* <div className="pointer-events-auto">
                <button onClick={toggleTheme} className="font-mono text-[1.7rem]">
                    {theme === "day" ? "Switch Night" : "Switch Day"}
                </button>
            </div> */}
        </header>
    );
}

