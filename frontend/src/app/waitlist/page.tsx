import type { Metadata } from "next";
import { IntroSection } from "./_components/intro-section";
import { HeroSection } from "./_components/hero-section";

import { DottedSurface } from "@/components/ui/dotted-surface";

export const metadata: Metadata = {
  title: "KiHobe — Bangladesh Prediction Markets",
  description:
    "Predict politics, cricket, and business in Bangladesh. Vote YES or NO, beat the crowd, and win bKash prizes. Join the waitlist.",
};

export default function WaitlistPage() {
  return (
    <main className="text-foreground min-h-screen relative">
      <DottedSurface />
      <div className="relative z-10">
        <IntroSection />
        <HeroSection />
        <div className="h-[40vh] sm:h-[50vh]" />
      </div>
    </main>
  );
}
