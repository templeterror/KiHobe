import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#F5F7F4",
  width: "device-width",
  initialScale: 1,
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
