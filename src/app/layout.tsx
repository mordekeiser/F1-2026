import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Nexus — Formula 1 World Championship 2026",
  description: "Live F1 standings, race schedule, circuits, drivers and teams — 2026 season",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
