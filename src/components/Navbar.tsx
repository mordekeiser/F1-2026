"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home",       href: "#home" },
  { label: "Schedule",   href: "#schedule" },
  { label: "Standings",  href: "#standings" },
  { label: "Circuits",   href: "#circuits" },
  { label: "Drivers",    href: "#drivers" },
  { label: "Teams",      href: "#teams" },
  { label: "Results",    href: "#results" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-[#e10600] ${scrolled ? "bg-black/95 backdrop-blur-md" : "bg-black/80 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <span className="text-[#e10600] text-xl font-black tracking-tight">F1</span>
          <span className="text-white text-xl font-bold tracking-tight">NEXUS</span>
          <span className="text-xs text-zinc-500 font-medium mt-0.5">2026</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150">
              {l.label}
            </a>
          ))}
        </div>

        {/* Live badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#e10600]/10 border border-[#e10600]/30 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#e10600] live-badge" />
          <span className="text-[#e10600] text-xs font-semibold">LIVE DATA</span>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-1.5">
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${open ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-black border-t border-zinc-800">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-6 py-3 text-sm text-zinc-400 hover:text-white hover:bg-white/5 border-b border-zinc-900">
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
