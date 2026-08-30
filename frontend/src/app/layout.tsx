import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4, IBM_Plex_Mono, Noto_Serif_Bengali } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
});

const notoBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-noto-bengali",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "KiHobe — Bangladesh prediction market",
  description: "Predict real-world outcomes and win prizes. Bangladesh's prediction market.",
  manifest: "/manifest.json",
  openGraph: {
    siteName: "KiHobe",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${archivo.variable} ${sourceSerif.variable} ${ibmPlexMono.variable} ${notoBengali.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
