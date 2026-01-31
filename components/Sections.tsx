"use client";

import { useRef } from "react";

export function AboutSection() {
    return (
        <section className="min-h-screen flex items-center justify-center pointer-events-none">
            <div className="max-w-[80rem] p-8 text-center text-light pointer-events-auto">
                <h2 className="h2 mb-4">About Us</h2>
                <p className="p1">
                    We are a creative agency bringing ideas to life.
                </p>
            </div>
        </section>
    );
}

export function ContactSection() {
    return (
        <section className="min-h-screen flex items-center justify-center pointer-events-none">
            <div className="max-w-[80rem] p-8 text-center text-light pointer-events-auto">
                <h2 className="h2 mb-4">Contact</h2>
                <p className="p1">
                    Get in touch with us.
                </p>
                <a href="mailto:hello@hle.io" className="a1 hover-underline">
                    hello@hle.io
                </a>
            </div>
        </section>
    );
}

export function FAQSection() {
    return (
        <section className="min-h-screen flex items-center justify-center pointer-events-none">
            <div className="max-w-[80rem] p-8 text-center text-light pointer-events-auto">
                <h2 className="h2 mb-4">FAQ</h2>
                <div className="text-left space-y-4">
                    <div className="border-b border-light/20 pb-4">
                        <h3 className="h3 mb-2">How do I start?</h3>
                        <p className="p2">Simply contact us.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
