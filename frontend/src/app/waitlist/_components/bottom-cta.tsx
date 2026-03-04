"use client";

import { KiHobeLogo } from "@/components/kihobe-logo";

export function BottomCta() {
  return (
    <footer className="px-4 py-6 max-w-6xl mx-auto border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/25 text-xs">
      <KiHobeLogo height={22} />
      <span>© {new Date().getFullYear()} KiHobe. Bangladesh prediction markets.</span>
    </footer>
  );
}
