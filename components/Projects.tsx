// "use client";

// import { useEffect, useRef, useState, useLayoutEffect } from "react";
// import gsap from "gsap";

// const projects = [
//     {
//         id: 1,
//         title: "DreamScreen",
//         description: "Interactive experience",
//         image: null,
//         tags: ["Immersive", "Interactive", "XR"],
//     },
//     {
//         id: 2,
//         title: "Across the Bridge",
//         description: "Documentary",
//         image: null,
//         tags: ["Documentary", "Social", "Impact"],
//     },
//     {
//         id: 3,
//         title: "Capture with Aaron Chang",
//         description: "TV Series",
//         image: null,
//         tags: ["Photography", "Education", "Series"],
//     },
//     {
//         id: 4,
//         title: "Tradesville",
//         description: "Reality TV",
//         image: null,
//         tags: ["Reality", "Construction", "Drama"],
//     },
// ];

// export default function Projects() {
//     const textRef = useRef<HTMLDivElement>(null);
//     const progressRef = useRef<HTMLDivElement>(null);
//     const cursorLineRef = useRef<SVGSVGElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [displayText, setDisplayText] = useState("");
//     const [typingComplete, setTypingComplete] = useState(false);

//     /* =============================
//        FAST TYPING TEXT - STAYS FIXED
//     ============================== */
//     useLayoutEffect(() => {
//         const baseText = "Positioned at the axis of talent and content across ";
//         const words = ["film", "music", "fashion"];
//         const typingSpeed = 0.01;

//         let timeout: any;

//         const typeBase = async () => {
//             for (let i = 0; i <= baseText.length; i++) {
//                 setDisplayText(baseText.slice(0, i));
//                 await new Promise((r) => (timeout = setTimeout(r, typingSpeed * 1000)));
//             }
//             cycleWords(0);
//         };

//         const cycleWords = async (index: number) => {
//             if (index >= words.length) return;
//             const word = words[index];

//             for (let i = 0; i <= word.length; i++) {
//                 setDisplayText(baseText + word.slice(0, i));
//                 await new Promise((r) => (timeout = setTimeout(r, typingSpeed * 1000)));
//             }

//             await new Promise((r) => setTimeout(r, 300));

//             if (index < words.length - 1) {
//                 for (let i = word.length; i >= 0; i--) {
//                     setDisplayText(baseText + word.slice(0, i));
//                     await new Promise((r) => (timeout = setTimeout(r, typingSpeed * 800)));
//                 }
//                 cycleWords(index + 1);
//             } else {
//                 setTypingComplete(true);
//                 gsap.to(progressRef.current, {
//                     scaleX: 1,
//                     duration: 1,
//                     ease: "power2.inOut",
//                 });
//             }
//         };

//         typeBase();

//         return () => clearTimeout(timeout);
//     }, []);

//     /* =============================
//        THICK DIGITAL MOUSE TRAIL
//     ============================== */
//     useEffect(() => {
//         const svg = cursorLineRef.current;
//         if (!svg) return;

//         const paths: SVGPathElement[] = [];
//         for (let i = 0; i < 3; i++) {
//             const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
//             path.setAttribute("fill", "none");
//             path.setAttribute("stroke", "#99FF99");
//             path.setAttribute("stroke-width", (5 + i * 2).toString());
//             path.setAttribute("stroke-linecap", "round");
//             path.setAttribute("stroke-linejoin", "round");
//             path.setAttribute("opacity", `${0.4 + i * 0.1}`);
//             svg.appendChild(path);
//             paths.push(path);
//         }

//         const points: { x: number; y: number }[] = [];
//         const maxPoints = 20;
//         const segmentLength = 15;

//         let mouseX = window.innerWidth / 2;
//         let mouseY = window.innerHeight / 2;

//         const onMouseMove = (e: MouseEvent) => {
//             mouseX = e.clientX;
//             mouseY = e.clientY;
//         };

//         const createDigitalPath = (points: { x: number; y: number }[], offset: number) => {
//             if (points.length < 2) return "";

//             let d = `M ${points[0].x + offset} ${points[0].y + offset}`;

//             for (let i = 1; i < points.length; i++) {
//                 const prev = points[i - 1];
//                 const curr = points[i];
//                 const midX = (prev.x + curr.x) / 2;
//                 const midY = (prev.y + curr.y) / 2;

//                 d += ` L ${midX + offset} ${prev.y + offset}`;
//                 d += ` L ${midX + offset} ${curr.y + offset}`;
//                 d += ` L ${curr.x + offset} ${curr.y + offset}`;
//             }

//             return d;
//         };

//         const animate = () => {
//             points.push({ x: mouseX, y: mouseY });
//             if (points.length > maxPoints) points.shift();

//             paths.forEach((path, i) => {
//                 const offset = (i - 1) * 3;
//                 const digitalPath = createDigitalPath(points, offset);
//                 path.setAttribute("d", digitalPath);
//             });

//             requestAnimationFrame(animate);
//         };

//         window.addEventListener("mousemove", onMouseMove);
//         animate();

//         return () => {
//             window.removeEventListener("mousemove", onMouseMove);
//             paths.forEach((path) => path.remove());
//         };
//     }, []);

//     /* =============================
//        3D BALL EFFECT
//     ============================== */
//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         const handleMouseMove = (e: MouseEvent) => {
//             const { clientX, clientY } = e;
//             const { width, height, left, top } = container.getBoundingClientRect();

//             const x = ((clientX - left) / width - 0.5) * 2;
//             const y = ((clientY - top) / height - 0.5) * 2;

//             const intensity = 30;
//             const rotateY = x * 5;
//             const rotateX = -y * 5;

//             const gridCells = container.querySelectorAll(".grid-cell");
//             gridCells.forEach((cell, index) => {
//                 const rect = cell.getBoundingClientRect();
//                 const cellX = ((rect.left + rect.width / 2 - left) / width - 0.5) * 2;
//                 const cellY = ((rect.top + rect.height / 2 - top) / height - 0.5) * 2;

//                 const distance = Math.sqrt(cellX * cellX + cellY * cellY);
//                 const sphereFactor = Math.cos((distance * Math.PI) / 2);

//                 (cell as HTMLElement).style.transform = `
//           translate3d(${x * intensity * sphereFactor}px, ${y * intensity * sphereFactor}px, ${sphereFactor * 50}px)
//           rotateX(${rotateX * sphereFactor}deg)
//           rotateY(${rotateY * sphereFactor}deg)
//           scale(${0.9 + sphereFactor * 0.2})
//         `;

//                 (cell as HTMLElement).style.opacity = `${0.3 + sphereFactor * 0.7}`;
//             });

//             gsap.to(container, {
//                 rotationY: rotateY,
//                 rotationX: rotateX,
//                 transformPerspective: 1000,
//                 duration: 0.5,
//                 ease: "power2.out",
//             });
//         };

//         container.addEventListener("mousemove", handleMouseMove);

//         return () => {
//             container.removeEventListener("mousemove", handleMouseMove);
//         };
//     }, []);

//     /* =============================
//        ANIMATED BORDER DRAWING EFFECT
//     ============================= */
//     useEffect(() => {
//         if (!typingComplete) return;

//         const borderElement = document.getElementById("header-border");
//         const headerElement = document.getElementById("projects-header");

//         if (!borderElement || !headerElement) return;

//         headerElement.style.position = "relative";
//         borderElement.style.position = "absolute";
//         borderElement.style.top = "-8px";
//         borderElement.style.left = "-8px";
//         borderElement.style.width = `calc(100% + 16px)`;
//         borderElement.style.height = `calc(100% + 16px)`;
//         borderElement.style.opacity = "0";
//         borderElement.style.borderRadius = "6px";
//         borderElement.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";

//         const tl = gsap.timeline({
//             defaults: { duration: 1.5, ease: "power2.inOut" },
//         });

//         tl.to(borderElement, { opacity: 1, duration: 0.5 })
//             .to(borderElement, {
//                 clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//                 duration: 2,
//                 ease: "power3.inOut",
//             })
//             .to(
//                 borderElement,
//                 {
//                     backgroundPosition: "100% 100%",
//                     duration: 3,
//                     repeat: -1,
//                     ease: "none",
//                 },
//                 "-=1.5"
//             );

//         return () => {
//             tl.kill();
//         };
//     }, [typingComplete]);

//     const scrollRef = useRef<HTMLDivElement>(null);

//     /* =============================
//          AUTO SCROLLING 3D BOOK-LIKE PROJECTS
//     ============================== */
//     useEffect(() => {
//         const scrollContainer = scrollRef.current;
//         if (!scrollContainer) return;

//         scrollContainer.innerHTML += scrollContainer.innerHTML;

//         const scrollWidth = scrollContainer.scrollWidth / 2;

//         const tl = gsap.to(scrollContainer, {
//             x: `-${scrollWidth}px`,
//             ease: "none",
//             duration: 25,
//             repeat: -1,
//         });

//         const cards = scrollContainer.querySelectorAll(".project-card");
//         cards.forEach((card) => {
//             card.addEventListener("mouseenter", () => {
//                 gsap.to(card, { scale: 1.2, zIndex: 10, duration: 0.5, ease: "power2.out" });
//             });
//             card.addEventListener("mouseleave", () => {
//                 gsap.to(card, { scale: 1, zIndex: 1, duration: 0.5, ease: "power2.out" });
//             });
//         });

//         return () => tl.kill();
//     }, []);

//     return (
//         <div className="w-full min-h-screen bg-black text-white perspective-1000">
//             {/* ELECTRIC GRID SECTION WITH 3D EFFECT */}
//             <div
//                 ref={containerRef}
//                 className="relative w-[80%] h-[70vh] mx-auto mt-20 border border-white/30 rounded-lg overflow-hidden"
//                 style={{
//                     transformStyle: "preserve-3d",
//                     perspective: "1000px",
//                 }}
//             >
//                 {/* Curved background for ball effect */}
//                 <div
//                     className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black rounded-[50%] opacity-30"
//                     style={{
//                         transform: "translateZ(-100px) scale(1.5)",
//                         borderRadius: "50%",
//                         background:
//                             "radial-gradient(circle at center, transparent 30%, rgba(0, 255, 255, 0.1) 70%, rgba(0, 255, 255, 0.05) 100%)",
//                     }}
//                 />

//                 {/* Grid Container with spherical layout */}
//                 <div className="absolute inset-0 overflow-hidden">
//                     {/* Main grid with spherical distortion */}
//                     <div className="absolute inset-0 grid grid-cols-16 grid-rows-8 opacity-40">
//                         {Array.from({ length: 16 * 8 }).map((_, i) => {
//                             const row = Math.floor(i / 16);
//                             const col = i % 16;
//                             const centerX = 7.5;
//                             const centerY = 3.5;
//                             const dx = col - centerX;
//                             const dy = row - centerY;

//                             const distance = Math.sqrt(dx * dx + dy * dy);
//                             const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
//                             const normalizedDistance = distance / maxDistance;

//                             const theta = (col / 16) * Math.PI * 2;
//                             const phi = (row / 8) * Math.PI;
//                             const radius = 100;

//                             const x = Math.sin(phi) * Math.cos(theta) * radius;
//                             const y = Math.cos(phi) * radius;
//                             const z = Math.sin(phi) * Math.sin(theta) * radius;

//                             return (
//                                 <div
//                                     key={i}
//                                     className="grid-cell border border-white/30 relative transition-all duration-300 ease-out"
//                                     style={{
//                                         transform: `translate3d(${x}px, ${y}px, ${z}px)`,
//                                         borderRadius: "2px",
//                                         boxShadow: `
//                       0 0 10px rgba(0, 255, 255, ${0.3 - normalizedDistance * 0.2}),
//                       inset 0 0 5px rgba(255, 255, 255, 0.1),
//                       0 0 20px rgba(0, 255, 255, 0.1)
//                     `,
//                                         background: `
//                       radial-gradient(
//                         circle at center,
//                         transparent 20%,
//                         rgba(0, 255, 255, ${0.1 - normalizedDistance * 0.05}) 50%,
//                         rgba(0, 255, 255, 0.05) 100%
//                       )
//                     `,
//                                         transformStyle: "preserve-3d",
//                                         willChange: "transform, opacity",
//                                     }}
//                                 />
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Typing Text - Centered with 3D effect */}
//                 <div className="absolute inset-0 flex items-center justify-center z-10 px-8">
//                     <div
//                         ref={textRef}
//                         className="w-full max-w-[90%] text-left"
//                         style={{
//                             transformStyle: "preserve-3d",
//                         }}
//                     >
//                         <div
//                             className="text-[4rem] md:text-[7rem] lg:text-[9rem] xl:text-[12rem] font-black leading-[0.9] tracking-tight"
//                             style={{
//                                 textShadow: `
//                   0 1px 0 #ccc,
//                   0 2px 0 #c9c9c9,
//                   0 3px 0 #bbb,
//                   0 4px 0 #b9b9b9,
//                   0 5px 0 #aaa,
//                   0 6px 1px rgba(0,0,0,.1),
//                   0 0 5px rgba(0,0,0,.1),
//                   0 1px 3px rgba(0,0,0,.3),
//                   0 3px 5px rgba(0,0,0,.2),
//                   0 5px 10px rgba(0,0,0,.25),
//                   0 10px 10px rgba(0,0,0,.2),
//                   0 20px 20px rgba(0,0,0,.15)
//                 `,
//                                 transform: "translateZ(50px)",
//                             }}
//                         >
//                             <span className="text-white relative">
//                                 {displayText}
//                                 {typingComplete && <span className="text-white blink-cursor">_</span>}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Cursor Lines with depth */}
//                 <svg
//                     ref={cursorLineRef}
//                     className="absolute inset-0 w-full h-full pointer-events-none z-20"
//                     style={{
//                         transformStyle: "preserve-3d",
//                         transform: "translateZ(30px)",
//                     }}
//                 >
//                     {/* Paths will be dynamically drawn via GSAP */}
//                 </svg>
//             </div>

//             {/* REST OF THE PAGE CONTENT */}
//             <div
//                 className="mt-40 p-8 text-white relative"
//                 style={{
//                     transformStyle: "preserve-3d",
//                     transform: "translateZ(20px)",
//                 }}
//             >
//                 {/* Main Content */}
//                 <div className="relative max-w-7xl mx-auto">
//                     {/* Animated Border Box around Header */}
//                     <div className="relative mb-12">
//                         {/* Border Drawing Animation */}
//                         <div
//                             id="header-border"
//                             className="absolute border-2 border-white pointer-events-none"
//                             style={{
//                                 top: "-12px",
//                                 left: "-12px",
//                                 right: "-12px",
//                                 bottom: "-12px",
//                                 opacity: 0,
//                                 borderRadius: "8px",
//                                 boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.3)",
//                                 background: "linear-gradient(45deg, transparent 40%, rgba(0, 255, 255, 0.08) 50%, transparent 60%)",
//                                 backgroundSize: "300% 300%",
//                             }}
//                         />

//                         {/* Header with styling */}
//                         <h1
//                             id="projects-header"
//                             className="text-5xl md:text-7xl font-bold py-6 px-8 relative inline-block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
//                         >
//                             Our Projects
//                         </h1>
//                     </div>

//                     {/* Content Paragraph */}
//                     <div className="mb-16">
//                         <p className="text-xl md:text-2xl leading-relaxed opacity-90 mb-8 px-4">
//                             Positioned at the axis of talent and content across film, television, music and beyond. HLE creates
//                             opportunities for the storytellers, trendsetters, and creatives of all types who are looking to get their
//                             message amplified. By helping shape original media that appeals to the industry's mandates.
//                         </p>
//                     </div>

//                     {/* Projects Section */}
//                     <div className="mb-24">
//                         <div className="relative w-full overflow-hidden py-8" style={{ perspective: "1000px" }}>
//                             <div
//                                 ref={scrollRef}
//                                 className="flex space-x-8 will-change-transform cursor-pointer py-4"
//                                 style={{ transformStyle: "preserve-3d" }}
//                             >
//                                 {projects.map((project) => (
//                                     <div
//                                         key={project.id}
//                                         className="project-card bg-gradient-to-br from-white to-gray-100 text-black shadow-2xl rounded-xl p-8 w-72 min-w-[288px] transform transition-all duration-300 hover:shadow-cyan-500/20"
//                                         style={{ transformStyle: "preserve-3d" }}
//                                     >
//                                         <div className="text-2xl font-bold mb-4 text-gray-900">{project.title}</div>
//                                         <div className="text-base text-gray-700 mb-6 font-medium">{project.description}</div>
//                                         <div className="flex flex-wrap gap-3">
//                                             {project.tags.map((tag, idx) => (
//                                                 <span
//                                                     key={idx}
//                                                     className="text-sm bg-gradient-to-r from-cyan-100 to-teal-100 text-gray-800 px-3 py-2 rounded-lg font-medium"
//                                                 >
//                                                     {tag}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* NEW SECTION: Added text at the end */}
//                     <div className="mt-32 mb-20 px-4">
//                         <div className="max-w-4xl mx-auto text-center">
//                             <div className="relative inline-block">
//                                 {/* Animated underline effect */}
//                                 <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>

//                                 <h2 className="text-4xl md:text-5xl font-bold mb-12 leading-tight">
//                                     <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
//                                         Helping people get their idea sold
//                                     </span>
//                                     <br />
//                                     <span className="text-white text-3xl md:text-4xl font-normal mt-4 block">
//                                         in a special way that fits this page
//                                     </span>
//                                 </h2>
//                             </div>

//                             <div className="mt-16 p-10 bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800/50 rounded-2xl backdrop-blur-sm">
//                                 <p className="text-xl md:text-2xl leading-relaxed text-gray-300 italic mb-8">
//                                     "We transform visions into compelling narratives that resonate with audiences and industry leaders alike."
//                                 </p>

//                                 <div className="flex flex-wrap justify-center gap-6 mt-12">
//                                     <div className="text-center px-6 py-4 bg-gray-900/40 rounded-xl">
//                                         <div className="text-3xl font-bold text-cyan-400 mb-2">360°</div>
//                                         <div className="text-gray-300">Creative Approach</div>
//                                     </div>

//                                     <div className="text-center px-6 py-4 bg-gray-900/40 rounded-xl">
//                                         <div className="text-3xl font-bold text-teal-400 mb-2">100%</div>
//                                         <div className="text-gray-300">Client Focus</div>
//                                     </div>

//                                     <div className="text-center px-6 py-4 bg-gray-900/40 rounded-xl">
//                                         <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
//                                         <div className="text-gray-300">Support & Collaboration</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//         </div>
//     );
// }


"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";

const projects = [
    {
        id: 1,
        title: "DreamScreen",
        description: "Interactive experience",
        image: null,
        tags: ["Immersive", "Interactive", "XR"],
    },
    {
        id: 2,
        title: "Across the Bridge",
        description: "Documentary",
        image: null,
        tags: ["Documentary", "Social", "Impact"],
    },
    {
        id: 3,
        title: "Capture with Aaron Chang",
        description: "TV Series",
        image: null,
        tags: ["Photography", "Education", "Series"],
    },
    {
        id: 4,
        title: "Tradesville",
        description: "Reality TV",
        image: null,
        tags: ["Reality", "Construction", "Drama"],
    },
];

export default function Projects() {
    const textRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const cursorLineRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState("");
    const [typingComplete, setTypingComplete] = useState(false);
    const ballContainerRef = useRef<HTMLDivElement>(null);

    /* =============================
       FAST TYPING TEXT - STAYS FIXED
    ============================== */
    useLayoutEffect(() => {
        const baseText = "Positioned at the axis of talent and content across ";
        const words = ["film", "music", "fashion"];
        const typingSpeed = 0.01;

        let timeout: any;

        const typeBase = async () => {
            for (let i = 0; i <= baseText.length; i++) {
                setDisplayText(baseText.slice(0, i));
                await new Promise((r) => (timeout = setTimeout(r, typingSpeed * 1000)));
            }
            cycleWords(0);
        };

        const cycleWords = async (index: number) => {
            if (index >= words.length) return;
            const word = words[index];

            for (let i = 0; i <= word.length; i++) {
                setDisplayText(baseText + word.slice(0, i));
                await new Promise((r) => (timeout = setTimeout(r, typingSpeed * 1000)));
            }

            await new Promise((r) => setTimeout(r, 300));

            if (index < words.length - 1) {
                for (let i = word.length; i >= 0; i--) {
                    setDisplayText(baseText + word.slice(0, i));
                    await new Promise((r) => (timeout = setTimeout(r, typingSpeed * 800)));
                }
                cycleWords(index + 1);
            } else {
                setTypingComplete(true);
                gsap.to(progressRef.current, {
                    scaleX: 1,
                    duration: 1,
                    ease: "power2.inOut",
                });
            }
        };

        typeBase();

        return () => clearTimeout(timeout);
    }, []);

    /* =============================
       THICK DIGITAL MOUSE TRAIL
    ============================== */
    useEffect(() => {
        const svg = cursorLineRef.current;
        if (!svg) return;

        const paths: SVGPathElement[] = [];
        for (let i = 0; i < 3; i++) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "#99FF99");
            path.setAttribute("stroke-width", (5 + i * 2).toString());
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute("opacity", `${0.4 + i * 0.1}`);
            svg.appendChild(path);
            paths.push(path);
        }

        const points: { x: number; y: number }[] = [];
        const maxPoints = 20;
        const segmentLength = 15;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const createDigitalPath = (points: { x: number; y: number }[], offset: number) => {
            if (points.length < 2) return "";

            let d = `M ${points[0].x + offset} ${points[0].y + offset}`;

            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const midX = (prev.x + curr.x) / 2;
                const midY = (prev.y + curr.y) / 2;

                d += ` L ${midX + offset} ${prev.y + offset}`;
                d += ` L ${midX + offset} ${curr.y + offset}`;
                d += ` L ${curr.x + offset} ${curr.y + offset}`;
            }

            return d;
        };

        const animate = () => {
            points.push({ x: mouseX, y: mouseY });
            if (points.length > maxPoints) points.shift();

            paths.forEach((path, i) => {
                const offset = (i - 1) * 3;
                const digitalPath = createDigitalPath(points, offset);
                path.setAttribute("d", digitalPath);
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMouseMove);
        animate();

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            paths.forEach((path) => path.remove());
        };
    }, []);

    /* =============================
       3D BALL EFFECT
    ============================== */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = container.getBoundingClientRect();

            const x = ((clientX - left) / width - 0.5) * 2;
            const y = ((clientY - top) / height - 0.5) * 2;

            const intensity = 30;
            const rotateY = x * 5;
            const rotateX = -y * 5;

            const gridCells = container.querySelectorAll(".grid-cell");
            gridCells.forEach((cell, index) => {
                const rect = cell.getBoundingClientRect();
                const cellX = ((rect.left + rect.width / 2 - left) / width - 0.5) * 2;
                const cellY = ((rect.top + rect.height / 2 - top) / height - 0.5) * 2;

                const distance = Math.sqrt(cellX * cellX + cellY * cellY);
                const sphereFactor = Math.cos((distance * Math.PI) / 2);

                (cell as HTMLElement).style.transform = `
          translate3d(${x * intensity * sphereFactor}px, ${y * intensity * sphereFactor}px, ${sphereFactor * 50}px)
          rotateX(${rotateX * sphereFactor}deg)
          rotateY(${rotateY * sphereFactor}deg)
          scale(${0.9 + sphereFactor * 0.2})
        `;

                (cell as HTMLElement).style.opacity = `${0.3 + sphereFactor * 0.7}`;
            });

            gsap.to(container, {
                rotationY: rotateY,
                rotationX: rotateX,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        container.addEventListener("mousemove", handleMouseMove);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    /* =============================
       ANIMATED BORDER DRAWING EFFECT
    ============================= */
    useEffect(() => {
        if (!typingComplete) return;

        const borderElement = document.getElementById("header-border");
        const headerElement = document.getElementById("projects-header");

        if (!borderElement || !headerElement) return;

        headerElement.style.position = "relative";
        borderElement.style.position = "absolute";
        borderElement.style.top = "-8px";
        borderElement.style.left = "-8px";
        borderElement.style.width = `calc(100% + 16px)`;
        borderElement.style.height = `calc(100% + 16px)`;
        borderElement.style.opacity = "0";
        borderElement.style.borderRadius = "6px";
        borderElement.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";

        const tl = gsap.timeline({
            defaults: { duration: 1.5, ease: "power2.inOut" },
        });

        tl.to(borderElement, { opacity: 1, duration: 0.5 })
            .to(borderElement, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 2,
                ease: "power3.inOut",
            })
            .to(
                borderElement,
                {
                    backgroundPosition: "100% 100%",
                    duration: 3,
                    repeat: -1,
                    ease: "none",
                },
                "-=1.5"
            );

        return () => {
            tl.kill();
        };
    }, [typingComplete]);

    /* =============================
       3D THIN BOOK-LIKE PROJECT CARDS
    ============================== */
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        const cards = scrollRef.current.querySelectorAll(".book-card");

        cards.forEach((card, index) => {
            // Set initial 3D book styles
            (card as HTMLElement).style.transformStyle = "preserve-3d";
            (card as HTMLElement).style.transform = `perspective(1000px) rotateY(${index * 5}deg) translateZ(${index * 10}px)`;

            // Add page flipping effect on hover
            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    rotationY: 5,
                    scale: 1.05,
                    z: 50,
                    duration: 0.8,
                    ease: "power3.out",
                });

                // Animate pages inside
                const pages = (card as HTMLElement).querySelectorAll(".book-page");
                pages.forEach((page, i) => {
                    gsap.to(page, {
                        rotationY: i * 2,
                        x: i * 2,
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: "power2.out",
                    });
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotationY: index * 5,
                    scale: 1,
                    z: index * 10,
                    duration: 0.8,
                    ease: "power3.out",
                });

                // Reset pages
                const pages = (card as HTMLElement).querySelectorAll(".book-page");
                pages.forEach((page) => {
                    gsap.to(page, {
                        rotationY: 0,
                        x: 0,
                        duration: 0.5,
                        ease: "power2.out",
                    });
                });
            });
        });

        // Auto-scroll with parallax effect
        const scrollContainer = scrollRef.current;
        let scrollX = 0;
        let animationId: number;

        const animateScroll = () => {
            scrollX -= 0.5;
            if (scrollX <= -scrollContainer.scrollWidth / 2) {
                scrollX = 0;
            }

            scrollContainer.style.transform = `translateX(${scrollX}px)`;

            // Parallax effect for cards
            cards.forEach((card, index) => {
                const speed = 0.5 + (index % 3) * 0.1;
                const parallaxX = scrollX * speed;
                gsap.to(card, {
                    x: parallaxX * 0.2,
                    rotationY: parallaxX * 0.01,
                    duration: 0.1,
                    ease: "none",
                });
            });

            animationId = requestAnimationFrame(animateScroll);
        };

        animateScroll();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    /* =============================
       ANIMATED ROTATING BALL SECTION
    ============================== */
    useEffect(() => {
        if (!ballContainerRef.current) return;

        const ball = ballContainerRef.current.querySelector(".rotating-ball");
        if (!ball) return;

        // Create floating particles around the ball
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement("div");
            particle.className = "absolute rounded-full bg-gradient-to-r from-cyan-500/30 to-teal-500/30";
            particle.style.width = `${Math.random() * 20 + 5}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            ballContainerRef.current.appendChild(particle);

            // Animate particles
            gsap.to(particle, {
                x: `+=${(Math.random() - 0.5) * 100}`,
                y: `+=${(Math.random() - 0.5) * 100}`,
                rotation: 360,
                duration: Math.random() * 3 + 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

        // Main ball rotation animation
        const ballTl = gsap.timeline({ repeat: -1 });

        ballTl
            .to(ball, {
                rotationY: 360,
                duration: 8,
                ease: "none",
            })
            .to(ball, {
                rotationX: 360,
                duration: 6,
                ease: "power2.inOut",
            }, 0)
            .to(ball, {
                scale: 1.2,
                duration: 4,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
            }, 0);

        // Interactive mouse follow
        const handleMouseMove = (e: MouseEvent) => {
            const rect = ballContainerRef.current!.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 50;

            gsap.to(ball, {
                x: x * 0.5,
                y: y * 0.5,
                duration: 1,
                ease: "power2.out",
            });
        };

        ballContainerRef.current.addEventListener("mousemove", handleMouseMove);

        return () => {
            ballTl.kill();
            ballContainerRef.current?.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // return (
    //     <div className="w-full min-h-screen bg-black text-white perspective-1000 overflow-hidden">
    //         {/* ELECTRIC GRID SECTION WITH 3D EFFECT */}
    //         <div
    //             ref={containerRef}
    //             className="relative w-[80%] h-[70vh] mx-auto mt-20 border border-white/30 rounded-lg overflow-hidden"
    //             style={{
    //                 transformStyle: "preserve-3d",
    //                 perspective: "1000px",
    //             }}
    //         >
    //             {/* Curved background for ball effect */}
    //             <div
    //                 className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black rounded-[50%] opacity-30"
    //                 style={{
    //                     transform: "translateZ(-100px) scale(1.5)",
    //                     borderRadius: "50%",
    //                     background:
    //                         "radial-gradient(circle at center, transparent 30%, rgba(0, 255, 255, 0.1) 70%, rgba(0, 255, 255, 0.05) 100%)",
    //                 }}
    //             />

    //             {/* Grid Container with spherical layout */}
    //             <div className="absolute inset-0 overflow-hidden">
    //                 {/* Main grid with spherical distortion */}
    //                 <div className="absolute inset-0 grid grid-cols-16 grid-rows-8 opacity-40">
    //                     {Array.from({ length: 16 * 8 }).map((_, i) => {
    //                         const row = Math.floor(i / 16);
    //                         const col = i % 16;
    //                         const centerX = 7.5;
    //                         const centerY = 3.5;
    //                         const dx = col - centerX;
    //                         const dy = row - centerY;

    //                         const distance = Math.sqrt(dx * dx + dy * dy);
    //                         const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    //                         const normalizedDistance = distance / maxDistance;

    //                         const theta = (col / 16) * Math.PI * 2;
    //                         const phi = (row / 8) * Math.PI;
    //                         const radius = 100;

    //                         const x = Math.sin(phi) * Math.cos(theta) * radius;
    //                         const y = Math.cos(phi) * radius;
    //                         const z = Math.sin(phi) * Math.sin(theta) * radius;

    //                         return (
    //                             <div
    //                                 key={i}
    //                                 className="grid-cell border border-white/30 relative transition-all duration-300 ease-out"
    //                                 style={{
    //                                     transform: `translate3d(${x}px, ${y}px, ${z}px)`,
    //                                     borderRadius: "2px",
    //                                     boxShadow: `
    //                   0 0 10px rgba(0, 255, 255, ${0.3 - normalizedDistance * 0.2}),
    //                   inset 0 0 5px rgba(255, 255, 255, 0.1),
    //                   0 0 20px rgba(0, 255, 255, 0.1)
    //                 `,
    //                                     background: `
    //                   radial-gradient(
    //                     circle at center,
    //                     transparent 20%,
    //                     rgba(0, 255, 255, ${0.1 - normalizedDistance * 0.05}) 50%,
    //                     rgba(0, 255, 255, 0.05) 100%
    //                   )
    //                 `,
    //                                     transformStyle: "preserve-3d",
    //                                     willChange: "transform, opacity",
    //                                 }}
    //                             />
    //                         );
    //                     })}
    //                 </div>
    //             </div>

    //             {/* Typing Text - Centered with 3D effect */}
    //             <div className="absolute inset-0 flex items-center justify-center z-10 px-8">
    //                 <div
    //                     ref={textRef}
    //                     className="w-full max-w-[90%] text-left"
    //                     style={{
    //                         transformStyle: "preserve-3d",
    //                     }}
    //                 >
    //                     <div
    //                         className="text-[4rem] md:text-[7rem] lg:text-[9rem] xl:text-[12rem] font-black leading-[0.9] tracking-tight"
    //                         style={{
    //                             textShadow: `
    //               0 1px 0 #ccc,
    //               0 2px 0 #c9c9c9,
    //               0 3px 0 #bbb,
    //               0 4px 0 #b9b9b9,
    //               0 5px 0 #aaa,
    //               0 6px 1px rgba(0,0,0,.1),
    //               0 0 5px rgba(0,0,0,.1),
    //               0 1px 3px rgba(0,0,0,.3),
    //               0 3px 5px rgba(0,0,0,.2),
    //               0 5px 10px rgba(0,0,0,.25),
    //               0 10px 10px rgba(0,0,0,.2),
    //               0 20px 20px rgba(0,0,0,.15)
    //             `,
    //                             transform: "translateZ(50px)",
    //                         }}
    //                     >
    //                         <span className="text-white relative">
    //                             {displayText}
    //                             {typingComplete && <span className="text-white blink-cursor">_</span>}
    //                         </span>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Cursor Lines with depth */}
    //             <svg
    //                 ref={cursorLineRef}
    //                 className="absolute inset-0 w-full h-full pointer-events-none z-20"
    //                 style={{
    //                     transformStyle: "preserve-3d",
    //                     transform: "translateZ(30px)",
    //                 }}
    //             >
    //                 {/* Paths will be dynamically drawn via GSAP */}
    //             </svg>
    //         </div>

    //         {/* REST OF THE PAGE CONTENT */}
    //         <div
    //             className="mt-40 p-8 text-white relative"
    //             style={{
    //                 transformStyle: "preserve-3d",
    //                 transform: "translateZ(20px)",
    //             }}
    //         >
    //             {/* Main Content */}
    //             <div className="relative max-w-7xl mx-auto">
    //                 {/* Animated Border Box around Header */}
    //                 <div className="relative mb-12">
    //                     {/* Border Drawing Animation */}
    //                     <div
    //                         id="header-border"
    //                         className="absolute border-2 border-white pointer-events-none"
    //                         style={{
    //                             top: "-12px",
    //                             left: "-12px",
    //                             right: "-12px",
    //                             bottom: "-12px",
    //                             opacity: 0,
    //                             borderRadius: "8px",
    //                             boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.3)",
    //                             background: "linear-gradient(45deg, transparent 40%, rgba(0, 255, 255, 0.08) 50%, transparent 60%)",
    //                             backgroundSize: "300% 300%",
    //                         }}
    //                     />

    //                     {/* Header with styling */}
    //                     <h1
    //                         id="projects-header"
    //                         className="text-5xl md:text-7xl font-bold py-6 px-8 relative inline-block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
    //                     >
    //                         Our Projects
    //                     </h1>
    //                 </div>

    //                 {/* Content Paragraph */}
    //                 <div className="mb-16">
    //                     <p className="text-xl md:text-2xl leading-relaxed opacity-90 mb-8 px-4">
    //                         Positioned at the axis of talent and content across film, television, music and beyond. HLE creates
    //                         opportunities for the storytellers, trendsetters, and creatives of all types who are looking to get their
    //                         message amplified. By helping shape original media that appeals to the industry's mandates.
    //                     </p>
    //                 </div>

    //                 {/* 3D Book-Like Projects Section */}
    //                 <div className="mb-24 relative">
    //                     <div className="relative w-full overflow-hidden py-12" style={{ perspective: "2000px" }}>
    //                         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>
    //                         <div
    //                             ref={scrollRef}
    //                             className="flex space-x-8 will-change-transform cursor-pointer py-8"
    //                             style={{ transformStyle: "preserve-3d" }}
    //                         >
    //                             {projects.map((project, index) => (
    //                                 <div
    //                                     key={project.id}
    //                                     className="book-card bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl rounded-lg p-6 w-80 min-w-[320px] h-96 relative border border-gray-800/50"
    //                                     style={{
    //                                         transformStyle: "preserve-3d",
    //                                         boxShadow: `
    //                                             0 20px 40px rgba(0, 0, 0, 0.5),
    //                                             inset 0 1px 0 rgba(255, 255, 255, 0.1),
    //                                             0 0 20px rgba(0, 200, 255, 0.2)
    //                                         `,
    //                                     }}
    //                                 >
    //                                     {/* Book spine effect */}
    //                                     <div
    //                                         className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-cyan-600 to-teal-600"
    //                                         style={{
    //                                             transform: "translateZ(-10px)",
    //                                             boxShadow: "inset 0 0 10px rgba(252, 255, 255, 1)",
    //                                         }}
    //                                     ></div>

    //                                     {/* Book pages effect */}
    //                                     <div className="book-page absolute right-2 top-4 bottom-4 w-3 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 opacity-60"></div>
    //                                     <div className="book-page absolute right-4 top-4 bottom-4 w-2 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 opacity-40"></div>
    //                                     <div className="book-page absolute right-6 top-4 bottom-4 w-1 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 opacity-30"></div>

    //                                     {/* Book cover content */}
    //                                     <div className="relative z-10 h-full flex flex-col justify-between">
    //                                         <div>
    //                                             <div className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-black to-white">
    //                                                 {project.title}
    //                                             </div>
    //                                             <div className="text-lg text-gray-300 mb-6 font-medium border-l-4 border-white pl-4 py-2">
    //                                                 {project.description}
    //                                             </div>
    //                                         </div>

    //                                         <div className="flex flex-wrap gap-3">
    //                                             {project.tags.map((tag, idx) => (
    //                                                 <span
    //                                                     key={idx}
    //                                                     className="text-sm bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg font-medium border border-gray-700/50"
    //                                                     style={{
    //                                                         transform: "translateZ(20px)",
    //                                                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
    //                                                     }}
    //                                                 >
    //                                                     {tag}
    //                                                 </span>
    //                                             ))}
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* ANIMATED ROTATING BALL SECTION */}
    //                 <div ref={ballContainerRef} className="mt-32 mb-20 px-4 relative">
    //                     <div className="max-w-6xl mx-auto">
    //                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    //                             {/* Text Content */}
    //                             <div className="relative z-20">
    //                                 <div className="relative inline-block mb-12">
    //                                     <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 blur-xl rounded-full"></div>
    //                                     <h2 className="text-5xl md:text-6xl font-bold leading-tight relative">
    //                                         <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
    //                                             Helping visionaries
    //                                         </span>
    //                                         <br />
    //                                         <span className="text-white text-4xl md:text-5xl font-normal mt-6 block">
    //                                             transform ideas into reality
    //                                         </span>
    //                                     </h2>
    //                                 </div>

    //                                 <div className="space-y-8">
    //                                     <p className="text-xl text-gray-300 leading-relaxed">
    //                                         We bridge the gap between creative vision and commercial success, crafting narratives that resonate deeply with audiences while meeting industry standards.
    //                                     </p>

    //                                     <div className="grid grid-cols-2 gap-6">
    //                                         <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
    //                                             <div className="text-4xl font-bold text-cyan-400 mb-3">360°</div>
    //                                             <div className="text-gray-300 font-medium">Holistic Creative Strategy</div>
    //                                         </div>
    //                                         <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
    //                                             <div className="text-4xl font-bold text-teal-400 mb-3">24/7</div>
    //                                             <div className="text-gray-300 font-medium">Dedicated Support</div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>

    //                             {/* Rotating 3D Ball */}
    //                             <div className="relative h-[500px] flex items-center justify-center">
    //                                 <div className="absolute inset-0 bg-gradient-to-br from-black to-white rounded-full blur-3xl"></div>

    //                                 <div
    //                                     className="rotating-ball w-64 h-64 relative"
    //                                     style={{
    //                                         transformStyle: "preserve-3d",
    //                                     }}
    //                                 >
    //                                     {/* Main Ball */}
    //                                     <div
    //                                         className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500"
    //                                         style={{
    //                                             transformStyle: "preserve-3d",
    //                                             boxShadow: `
    //                                                 inset 0 0 50px rgba(255, 255, 255, 0.14),
    //                                                 0 0 80px rgba(3, 4, 4, 0.4),
    //                                                 0 0 120px rgba(232, 239, 241, 0.95)
    //                                             `,
    //                                         }}
    //                                     >
    //                                         {/* Inner glowing core */}
    //                                         <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>

    //                                         {/* Grid lines for 3D effect */}
    //                                         <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
    //                                         <div
    //                                             className="absolute inset-0 rounded-full border-2 border-white/20"
    //                                             style={{ transform: "rotateX(60deg)" }}
    //                                         ></div>
    //                                         <div
    //                                             className="absolute inset-0 rounded-full border-2 border-white/20"
    //                                             style={{ transform: "rotateY(60deg)" }}
    //                                         ></div>
    //                                     </div>

    //                                     {/* Orbiting rings */}
    //                                     <div
    //                                         className="absolute inset-[-50px] rounded-full border border-cyan-500/30"
    //                                         style={{
    //                                             animation: "spin 10s linear infinite",
    //                                             transformStyle: "preserve-3d",
    //                                         }}
    //                                     ></div>
    //                                     <div
    //                                         className="absolute inset-[-80px] rounded-full border border-teal-500/20"
    //                                         style={{
    //                                             animation: "spin 15s linear infinite reverse",
    //                                             transformStyle: "preserve-3d",
    //                                         }}
    //                                     ></div>
    //                                     <div
    //                                         className="absolute inset-[-110px] rounded-full border border-emerald-500/10"
    //                                         style={{
    //                                             animation: "spin 20s linear infinite",
    //                                             transformStyle: "preserve-3d",
    //                                         }}
    //                                     ></div>

    //                                     {/* Floating elements */}
    //                                     {[1, 2, 3, 4].map((i) => (
    //                                         <div
    //                                             key={i}
    //                                             className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
    //                                             style={{
    //                                                 left: `${Math.cos(i * Math.PI / 2) * 150}px`,
    //                                                 top: `${Math.sin(i * Math.PI / 2) * 150}px`,
    //                                                 transform: `translate(-50%, -50%)`,
    //                                                 filter: "blur(1px)",
    //                                                 animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
    //                                             }}
    //                                         ></div>
    //                                     ))}
    //                                 </div>

    //                                 {/* Connection lines to text */}
    //                                 <div className="absolute inset-0 pointer-events-none">
    //                                     <svg className="w-full h-full">
    //                                         <defs>
    //                                             <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    //                                                 <stop offset="0%" stopColor="#4B5563" stopOpacity="0.5" />
    //                                                 <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
    //                                             </linearGradient>
    //                                         </defs>
    //                                         <path
    //                                             d="M 0,250 Q 200,200 400,250"
    //                                             stroke="url(#line-gradient)"
    //                                             strokeWidth="2"
    //                                             fill="none"
    //                                             className="animate-pulse"
    //                                         />
    //                                     </svg>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Global Animations */}
    //         <style jsx>{`
    //             @keyframes spin {
    //                 from { transform: rotate(0deg); }
    //                 to { transform: rotate(360deg); }
    //             }
    //             @keyframes float {
    //                 0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
    //                 50% { transform: translate(-50%, -50%) translateY(-20px); }
    //             }
    //             .blink-cursor {
    //                 animation: blink 1s infinite;
    //             }
    //             @keyframes blink {
    //                 0%, 100% { opacity: 1; }
    //                 50% { opacity: 0; }
    //             }
    //             .perspective-1000 {
    //                 perspective: 1000px;
    //             }
    //         `}</style>
    //     </div>
    // );



    return (
        <div className="w-full min-h-screen bg-black text-white perspective-1000 overflow-hidden">
            {/* ELECTRIC GRID SECTION WITH 3D EFFECT - REDUCED SQUARES */}
            <div
                ref={containerRef}
                className="relative w-[80%] h-[70vh] mx-auto mt-20 border border-white/30 rounded-lg overflow-hidden"
                style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                }}
            >
                {/* Curved background for ball effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-black via-black to-black rounded-[50%] opacity-30"
                    style={{
                        transform: "translateZ(-100px) scale(1.5)",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle at center, transparent 30%, rgba(0, 100, 0, 0.1) 70%, rgba(0, 100, 0, 0.05) 100%)",
                    }}
                />

                {/* Grid Container with spherical layout - REDUCED GRID SIZE */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Main grid with spherical distortion - FEWER SQUARES (12x6 instead of 16x8) */}
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-40">
                        {Array.from({ length: 12 * 6 }).map((_, i) => {
                            const row = Math.floor(i / 12);
                            const col = i % 12;
                            const centerX = 5.5;
                            const centerY = 2.5;
                            const dx = col - centerX;
                            const dy = row - centerY;

                            const distance = Math.sqrt(dx * dx + dy * dy);
                            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
                            const normalizedDistance = distance / maxDistance;

                            const theta = (col / 12) * Math.PI * 2;
                            const phi = (row / 6) * Math.PI;
                            const radius = 100;

                            const x = Math.sin(phi) * Math.cos(theta) * radius;
                            const y = Math.cos(phi) * radius;
                            const z = Math.sin(phi) * Math.sin(theta) * radius;

                            return (
                                <div
                                    key={i}
                                    className="grid-cell border border-white/30 relative transition-all duration-300 ease-out"
                                    style={{
                                        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                                        borderRadius: "2px",
                                        boxShadow: `
                                        0 0 10px rgba(0, 100, 0, ${0.3 - normalizedDistance * 0.2}),
                                        inset 0 0 5px rgba(255, 255, 255, 0.1),
                                        0 0 20px rgba(0, 100, 0, 0.1)
                                    `,
                                        background: `
                                        radial-gradient(
                                            circle at center,
                                            transparent 20%,
                                            rgba(0, 100, 0, ${0.1 - normalizedDistance * 0.05}) 50%,
                                            rgba(0, 100, 0, 0.05) 100%
                                        )
                                    `,
                                        transformStyle: "preserve-3d",
                                        willChange: "transform, opacity",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Typing Text - Centered with 3D effect */}
                <div className="absolute inset-0 flex items-center justify-center z-10 px-8">
                    <div
                        ref={textRef}
                        className="w-full max-w-[90%] text-left"
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <div
                            className="text-[4rem] md:text-[7rem] lg:text-[9rem] xl:text-[12rem] font-black leading-[0.9] tracking-tight"
                            style={{
                                textShadow: `
                                0 1px 0 #ccc,
                                0 2px 0 #c9c9c9,
                                0 3px 0 #bbb,
                                0 4px 0 #b9b9b9,
                                0 5px 0 #aaa,
                                0 6px 1px rgba(0,0,0,.1),
                                0 0 5px rgba(0,0,0,.1),
                                0 1px 3px rgba(0,0,0,.3),
                                0 3px 5px rgba(0,0,0,.2),
                                0 5px 10px rgba(0,0,0,.25),
                                0 10px 10px rgba(0,0,0,.2),
                                0 20px 20px rgba(0,0,0,.15)
                            `,
                                transform: "translateZ(50px)",
                            }}
                        >
                            <span className="text-white relative">
                                {displayText}
                                {typingComplete && <span className="text-white blink-cursor">_</span>}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cursor Lines with depth */}
                <svg
                    ref={cursorLineRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-20"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: "translateZ(30px)",
                    }}
                >
                    {/* Paths will be dynamically drawn via GSAP */}
                </svg>
            </div>

            {/* REST OF THE PAGE CONTENT */}
            <div
                className="mt-40 p-8 text-white relative"
                style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(20px)",
                }}
            >
                {/* Main Content */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Animated Border Box around Header */}
                    <div className="relative mb-12">
                        {/* Border Drawing Animation */}
                        <div
                            id="header-border"
                            className="absolute border-2 border-white pointer-events-none"
                            style={{
                                top: "-12px",
                                left: "-12px",
                                right: "-12px",
                                bottom: "-12px",
                                opacity: 0,
                                borderRadius: "8px",
                                boxShadow: "0 0 20px rgba(0, 100, 0, 0.4), inset 0 0 15px rgba(0, 100, 0, 0.3)",
                                background: "linear-gradient(45deg, transparent 40%, rgba(0, 100, 0, 0.08) 50%, transparent 60%)",
                                backgroundSize: "300% 300%",
                            }}
                        />

                        {/* Header with styling */}
                        <h1
                            id="projects-header"
                            className="text-5xl md:text-7xl font-bold py-6 px-8 relative inline-block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        >
                            Our Projects
                        </h1>
                    </div>

                    {/* Content Paragraph */}
                    <div className="mb-16">
                        <p className="text-xl md:text-2xl leading-relaxed opacity-90 mb-8 px-4">
                            Positioned at the axis of talent and content across film, television, music and beyond. HLE creates
                            opportunities for the storytellers, trendsetters, and creatives of all types who are looking to get their
                            message amplified. By helping shape original media that appeals to the industry's mandates.
                        </p>
                    </div>

                    {/* 3D Book-Like Projects Section */}
                    <div className="mb-24 relative">
                        <div className="relative w-full overflow-hidden py-12" style={{ perspective: "2000px" }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none"></div>
                            <div
                                ref={scrollRef}
                                className="flex space-x-8 will-change-transform cursor-pointer py-8"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {projects.map((project, index) => (
                                    <div
                                        key={project.id}
                                        className="book-card bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl rounded-lg p-6 w-80 min-w-[320px] h-96 relative border border-white/10"
                                        style={{
                                            transformStyle: "preserve-3d",
                                            boxShadow: `
                                            0 20px 40px rgba(0, 0, 0, 0.5),
                                            inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                            0 0 20px rgba(0, 100, 0, 0.2)
                                        `,
                                        }}
                                    >
                                        {/* Book spine effect */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-green-800 to-green-900"
                                            style={{
                                                transform: "translateZ(-10px)",
                                                boxShadow: "inset 0 0 10px rgba(255, 255, 255, 1)",
                                            }}
                                        ></div>

                                        {/* Book pages effect */}
                                        <div className="book-page absolute right-2 top-4 bottom-4 w-3 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 opacity-60"></div>
                                        <div className="book-page absolute right-4 top-4 bottom-4 w-2 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 opacity-40"></div>
                                        <div className="book-page absolute right-6 top-4 bottom-4 w-1 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 opacity-30"></div>

                                        {/* Book cover content */}
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="text-3xl font-bold mb-4 text-white">
                                                    {project.title}
                                                </div>
                                                <div className="text-lg text-gray-300 mb-6 font-medium border-l-4 border-white pl-4 py-2">
                                                    {project.description}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {project.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-sm bg-gradient-to-r from-green-800 to-black text-white px-4 py-2 rounded-lg font-medium border border-green-800/50"
                                                        style={{
                                                            transform: "translateZ(20px)",
                                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ANIMATED ROTATING BALL SECTION */}
                    <div ref={ballContainerRef} className="mt-32 mb-20 px-4 relative">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                {/* Text Content */}
                                <div className="relative z-20">
                                    <div className="relative inline-block mb-12">
                                        <div className="absolute -inset-4 bg-gradient-to-r from-green-900  to-emerald-800 blur-xl rounded-full"></div>
                                        <h2 className="text-5xl md:text-6xl font-bold leading-tight relative">
                                            <span className="bg-gradient-to-r from-green-900 via-green-500 to-emerald-800 bg-clip-text text-transparent">
                                                Helping visionaries
                                            </span>
                                            <br />
                                            <span className="text-white text-4xl md:text-5xl font-normal mt-6 block">
                                                transform ideas into reality
                                            </span>
                                        </h2>
                                    </div>

                                    <div className="space-y-8">
                                        <p className="text-xl text-gray-300 leading-relaxed">
                                            We bridge the gap between creative vision and commercial success, crafting narratives that resonate deeply with audiences while meeting industry standards.
                                        </p>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                <div className="text-4xl font-bold text-green-900 mb-3">360°</div>
                                                <div className="text-gray-300 font-medium">Holistic Creative Strategy</div>
                                            </div>
                                            <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                <div className="text-4xl font-bold text-green-800 mb-3">24/7</div>
                                                <div className="text-gray-300 font-medium">Dedicated Support</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rotating 3D Ball */}
                                <div className="relative h-[500px] flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-black to-white rounded-full blur-3xl"></div>

                                    <div
                                        className="rotating-ball w-64 h-64 relative"
                                        style={{
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        {/* Main Ball */}
                                        <div
                                            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-900 via-green-700 to-emerald-800"
                                            style={{
                                                transformStyle: "preserve-3d",
                                                boxShadow: `
                                                inset 0 0 50px rgba(255, 255, 255, 0.14),
                                                0 0 80px rgba(0, 100, 0, 0.4),
                                                0 0 120px rgba(0, 100, 0, 0.95)
                                            `,
                                            }}
                                        >
                                            {/* Inner glowing core */}
                                            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>

                                            {/* Grid lines for 3D effect */}
                                            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                                            <div
                                                className="absolute inset-0 rounded-full border-2 border-white/20"
                                                style={{ transform: "rotateX(60deg)" }}
                                            ></div>
                                            <div
                                                className="absolute inset-0 rounded-full border-2 border-white/20"
                                                style={{ transform: "rotateY(60deg)" }}
                                            ></div>
                                        </div>

                                        {/* Orbiting rings */}
                                        <div
                                            className="absolute inset-[-50px] rounded-full border border-green-800"
                                            style={{
                                                animation: "spin 10s linear infinite",
                                                transformStyle: "preserve-3d",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-[-80px] rounded-full border border-green-700"
                                            style={{
                                                animation: "spin 15s linear infinite reverse",
                                                transformStyle: "preserve-3d",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-[-110px] rounded-full border border-green-900"
                                            style={{
                                                animation: "spin 20s linear infinite",
                                                transformStyle: "preserve-3d",
                                            }}
                                        ></div>

                                        {/* Floating elements */}
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-green-900  to-emerald-800 "
                                                style={{
                                                    left: `${Math.cos(i * Math.PI / 2) * 150}px`,
                                                    top: `${Math.sin(i * Math.PI / 2) * 150}px`,
                                                    transform: `translate(-50%, -50%)`,
                                                    filter: "blur(1px)",
                                                    animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    {/* Connection lines to text */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <svg className="w-full h-full">
                                            <defs>
                                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#4B5563" stopOpacity="0.5" />
                                                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d="M 0,250 Q 200,200 400,250"
                                                stroke="url(#line-gradient)"
                                                strokeWidth="2"
                                                fill="none"
                                                className="animate-pulse"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Animations */}
            <style jsx>{`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes float {
                0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                50% { transform: translate(-50%, -50%) translateY(-20px); }
            }
            .blink-cursor {
                animation: blink 1s infinite;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            .perspective-1000 {
                perspective: 1000px;
            }
        `}</style>
        </div>
    );
}