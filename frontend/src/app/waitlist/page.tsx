import type { Metadata } from "next";
import { LandingNav } from "./_components/landing-nav";
import { HeroSection } from "./_components/hero-section";
import { AddaSection } from "./_components/adda-section";
import { HowSection } from "./_components/how-section";
import { EdgeSection } from "./_components/edge-section";
import { MarketsSection } from "./_components/markets-section";
import { ScoreboardSection } from "./_components/scoreboard-section";
import { LandingFooter } from "./_components/landing-footer";

export const metadata: Metadata = {
  title: "KiHobe — Bangladesh's first prediction market",
  description:
    "Every adda ends with dekhi ki hobe. KiHobe keeps score — predict cricket, politics, and the rest, and get rewarded when you're right.",
  openGraph: {
    title: "KiHobe — Bangladesh's first prediction market",
    description:
      "Every adda ends with dekhi ki hobe. KiHobe keeps score — predict cricket, politics, and the rest, and get rewarded when you're right.",
    images: [{ url: "/og-image.png", width: 1080, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KiHobe — Bangladesh's first prediction market",
    description:
      "Every adda ends with dekhi ki hobe. KiHobe keeps score — predict cricket, politics, and the rest, and get rewarded when you're right.",
    images: ["/og-image.png"],
  },
};

export default function WaitlistPage() {
  return (
    <div className="landing">
      <LandingNav />
      <main>
        <HeroSection />
        <AddaSection />
        <HowSection />
        <EdgeSection />
        <MarketsSection />
        <ScoreboardSection />
      </main>
      <LandingFooter />
    </div>
  );
}
