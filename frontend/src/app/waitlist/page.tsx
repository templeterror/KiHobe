import type { Metadata } from "next";
import { IntroSection } from "./_components/intro-section";
import { HeroSection } from "./_components/hero-section";
import { HowItWorks } from "./_components/how-it-works";
import { CallToAction } from "./_components/call-to-action";
import { BottomCta } from "./_components/bottom-cta";

export const metadata: Metadata = {
  title: "KiHobe — Bangladesh Prediction Markets",
  description:
    "Predict politics, cricket, and business in Bangladesh. Vote YES or NO, beat the crowd, and win bKash prizes. Join the waitlist.",
};

export default function WaitlistPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <IntroSection />
      <HeroSection />
      <HowItWorks />
      <CallToAction />
      <BottomCta />
    </main>
  );
}
