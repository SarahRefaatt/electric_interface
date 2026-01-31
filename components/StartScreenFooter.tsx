"use client";

import { useEffect, useState } from "react";

export default function StartScreenFooter() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const ampm = hours >= 12 ? "pm" : "am";
            const hours12 = hours % 12 || 12;
            setTime(`${hours12.toString().padStart(2, "0")} : ${minutes} ${ampm}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 w-full z-[100] px-[4rem] pb-[2.4rem] flex justify-between items-end pointer-events-none text-dark dark:text-light transition-colors duration-500">
            <div className="p2 max-w-[35.8rem] hidden md:block">
                Positioned at the axis of talent and content across film
            </div>

            <div className="absolute left-1/2 bottom-[2.4rem] -translate-x-1/2 flex items-center gap-[0.5rem] p2">
                <span>Scroll Down</span>
                {/* Scroll Down Icon if needed, simplified to unicode/text for now or SVG later */}
                <span className="w-[0.9rem] h-[0.9rem] bg-current block ml-[0.5rem]" />
            </div>

            <div className="p2 tabular-nums">
                {time}
            </div>
        </footer>
    );
}
