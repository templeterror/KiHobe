"use client";

import { useEffect, useState } from "react";
import { KiHobeLogo } from "@/components/kihobe-logo";

const links = [
  { href: "#how", label: "How" },
  { href: "#markets", label: "Markets" },
  { href: "#edge", label: "The edge" },
  { href: "#rank", label: "Rank" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["how", "markets", "edge", "rank"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-[var(--landing-bg)]/90 backdrop-blur-md border-b border-[var(--landing-line)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#top" aria-label="KiHobe home" className="shrink-0">
          <KiHobeLogo height={28} color="#00DD94" />
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`font-odds px-2 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors sm:px-3 sm:text-xs ${
                    active === link.href ? "text-[var(--brand-ink)]" : "text-[var(--landing-ghost)] hover:text-[var(--landing-ink)]"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#waitlist"
            className="font-display shrink-0 rounded-full bg-[#00DD94] px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-[#050D0A] [font-stretch:condensed] sm:px-4 sm:text-xs"
          >
            Join waitlist
          </a>
        </div>
      </nav>
    </header>
  );
}
