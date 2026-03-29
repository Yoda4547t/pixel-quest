import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-press-start",
});

import { ToasterProvider } from "@/components/ui/ToasterProvider";
import { AuthProvider } from "@/components/features/AuthProvider";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PixelQuest",
  description: "A retro pixel-themed gamified productivity platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${pressStart2P.variable} font-pixel antialiased bg-background text-foreground h-screen w-screen overflow-hidden`}>
        <GlobalLoader />
        <AuthProvider>
          {children}
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
