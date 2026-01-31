
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState("");

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            const baseText = "Positioned at the axis of talent and content across ";
            const words = ["film", "music", "fashion"];

            // Calculate total duration for typing speed control
            const baseTextChars = baseText.length;
            const typingSpeed = 0.3; // Adjustable: lower = faster
            const baseDuration = baseTextChars * typingSpeed;

            // Type base text character by character
            tl.call(() => {
                let i = 0;
                const typeBaseText = () => {
                    if (i <= baseTextChars) {
                        setDisplayText(baseText.substring(0, i));
                        i++;
                        setTimeout(typeBaseText, typingSpeed * 100);
                    } else {
                        // Start cycling through words after base text is typed
                        cycleWords(0);
                    }
                };
                typeBaseText();
            });

            const cycleWords = (index: number) => {
                if (index >= words.length) return;

                const word = words[index];
                let i = 0;

                // Type the word
                const typeWord = () => {
                    if (i <= word.length) {
                        setDisplayText(baseText + word.substring(0, i));
                        i++;
                        setTimeout(typeWord, typingSpeed * 100);
                    } else {
                        // Pause
                        setTimeout(() => {
                            if (index < words.length - 1) {
                                // Delete the word (except for last word)
                                let j = word.length;
                                const deleteWord = () => {
                                    if (j >= 0) {
                                        setDisplayText(baseText + word.substring(0, j));
                                        j--;
                                        setTimeout(deleteWord, typingSpeed * 80); // Faster deletion
                                    } else {
                                        // Move to next word
                                        setTimeout(() => cycleWords(index + 1), 200);
                                    }
                                };
                                deleteWord();
                            } else {
                                // Last word - don't delete, just finish
                                setTimeout(() => {
                                    tl.to(textRef.current, {
                                        opacity: 0,
                                        y: -50,
                                        duration: 0.8,
                                        ease: "power2.out"
                                    }, "+=0.3")

                                        .to(containerRef.current, {
                                            y: "-100%",
                                            duration: 1,
                                            ease: "power2.inOut",
                                        }, "-=0.3");
                                }, 500); // Pause on last word
                            }
                        }, 300); // Pause after typing word
                    }
                };
                typeWord();
            };

            // Start progress bar
            tl.to(progressRef.current, {
                scaleX: 1,
                duration: (baseTextChars + words.reduce((sum, word) => sum + word.length * 2, 0)) * typingSpeed * 0.1 + 2,
                ease: "power2.inOut",
            }, 0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] flex flex-col justify-between bg-dark p-[4.8rem] text-light sm:p-[4rem] text-[6rem] sm:text-[11.8rem] leading-[0.99] font-normal overflow-hidden"
        >
            <div ref={textRef} className="max-w-[123.6rem] relative">
                {displayText}
                <span className="inline-block w-[0.1em] h-[1em] bg-light ml-1 align-text-top animate-pulse" />
            </div>

            <div className="relative w-full h-[1px]">
                <div
                    ref={progressRef}
                    className="absolute left-0 bottom-[4.8rem] w-full h-px bg-[#383838] origin-left scale-x-0"
                />
            </div>
        </div>


    );
}