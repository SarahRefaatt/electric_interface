

"use client";

import { useEffect, useRef, useState } from "react";

import Preloader from "../components/Preloader";
import Header from "../components/Header";
import CanvasScroll from "../components/CanvasScroll";
import Projects from "../components/Projects";
import { ThemeProvider } from "../context/ThemeContext";
import {
  AboutSection,
  ContactSection,
  FAQSection,
} from "../components/Sections";

export default function Home() {
  const [loading, setLoading] = useState(true);



  /* -------------------- Preloader -------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  //updatedddd 55
  /* -------------------- Render -------------------- */
  return (
    <ThemeProvider>
      {loading && <Preloader />}
      <Header />

      <main className="relative w-full">
        {/* Canvas Scroll Content */}

        {/* @ts-expect-error children are intentionally ignored */}

        <CanvasScroll>
          <div className="relative flex flex-col w-full h-full pointer-events-none">
            <div className="min-h-screen" />

            <section
              id="about"
              className="min-h-screen flex items-center justify-center"
            >
              <div className="pointer-events-auto">
                <AboutSection />
              </div>
            </section>

            <section
              id="contacts"
              className="min-h-screen flex items-center justify-center"
            >
              <div className="pointer-events-auto">
                <ContactSection />
              </div>
            </section>

            <section
              id="faq"
              className="min-h-screen flex items-center justify-center pb-20"
            >
              <div className="pointer-events-auto">
                <FAQSection />
              </div>
            </section>

            {/* ScrollTrigger marker */}
            <div id="canvas-end-trigger" className="min-h-screen" />
            <div className="min-h-screen" />
          </div>
        </CanvasScroll>
      </main>
      {/* <Projects /> */}
    </ThemeProvider>
  );
}
