import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HLE",
  description: "Helping people bring their ideas to fruition through our network of partners in NYC and LA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
