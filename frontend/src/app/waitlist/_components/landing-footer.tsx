import { KiHobeLogo } from "@/components/kihobe-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--landing-line)] px-5 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8">
        <KiHobeLogo height={36} color="#00DD94" />
        <p className="font-editorial max-w-sm text-lg italic text-[var(--landing-faint)]">
          The scoreboard for Bangladesh adda.
        </p>
      </div>
    </footer>
  );
}
