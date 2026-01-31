"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "day" | "night";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("day");

    useEffect(() => {
        // On mount, check if there's a stored preference or system preference
        // For this clone, default to "day" as per site
        document.documentElement.classList.remove("night-mode");
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === "day" ? "night" : "day";
            if (newTheme === "night") {
                document.documentElement.classList.add("night-mode");
                // Update CSS variables if needed, but the CSS handles :root vs .night-mode often
                // Inspecting site.html CSS: .night-mode .classname overrides properties
            } else {
                document.documentElement.classList.remove("night-mode");
            }
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
