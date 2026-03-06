import type { Metadata } from "next";
import { IntroSection } from "./_components/intro-section";
import { HeroSection } from "./_components/hero-section";

import { DottedSurface } from "@/components/ui/dotted-surface";

export const metadata: Metadata = {
  title: "KiHobe — Bangladesh's First Prediction Market",
  description: "Get Rewarded for your right predictions",
  openGraph: {
    title: "KiHobe — Bangladesh's First Prediction Market",
    description: "Get Rewarded for your right predictions",
    images: [{ url: "/og-image.png", width: 1080, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KiHobe — Bangladesh's First Prediction Market",
    description: "Get Rewarded for your right predictions",
    images: ["/og-image.png"],
  },
};

export default function WaitlistPage() {
  return (
    <main className="text-foreground min-h-screen relative">
      <DottedSurface />
      <div className="relative z-10">
        <IntroSection />
        <HeroSection />
        <div className="h-[15vh] sm:h-[20vh]" />
      </div>
    </main>
  );
}
