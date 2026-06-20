"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { circuits } from "@/data/circuits";

const TRACK_PATHS = [
  "M80,155 C80,90 120,55 168,55 C218,55 262,88 262,148 C262,182 242,202 210,207 L170,211 C136,214 111,196 95,177 C79,157 80,168 80,155Z M138,103 L172,89 L202,106 L193,138 L164,144 L139,124Z",
  "M62,168 L96,56 L183,56 L248,110 L273,168 L193,183 L149,173 L103,183Z M109,114 L152,94 L198,116 L186,154 L124,158Z",
  "M66,62 L104,62 C192,62 268,100 273,168 C276,198 248,213 198,213 L100,213 C71,213 56,194 56,163 C56,94 66,62 66,62Z M94,99 L173,99 L202,165 L94,165Z",
  "M76,56 L244,56 L268,134 L244,212 L76,212 L52,134Z M99,89 L218,89 L238,134 L218,178 L99,178 L81,134Z",
  "M154,36 C90,36 51,75 51,144 C51,203 90,232 154,232 C218,232 257,203 257,144 C257,105 236,75 203,58 L203,99 L174,99 L174,58 C169,54 162,50 154,36Z",
  "M56,128 C56,70 100,41 163,41 C203,41 238,58 256,88 L256,61 L288,61 L288,119 C288,183 244,213 175,213 L131,213 C91,213 56,188 56,128Z",
  "M61,100 L119,56 L228,56 C263,56 283,80 283,120 C283,164 258,188 214,193 L174,198 L130,198 C91,198 61,174 61,134Z M99,89 L209,89 L238,133 L209,163 L99,163Z",
  "M91,56 C91,56 71,81 61,120 C56,144 61,173 80,188 C99,203 133,209 163,209 C213,209 253,193 263,163 C272,133 253,104 229,89 C210,78 185,70 165,68 C141,65 111,56 91,56Z",
  "M71,56 L249,56 L273,154 L194,203 L131,203 L56,154Z M99,89 L218,89 L238,153 L188,173 L141,173 L91,153Z",
  "M164,41 C101,41 61,85 61,149 C61,194 85,223 129,226 L164,228 L199,226 C243,223 267,194 267,149 C267,85 228,41 164,41Z",
  "M56,119 C56,66 100,41 163,41 L193,41 C238,41 268,65 268,114 C268,158 246,188 213,198 L163,208 L114,198 C82,188 56,163 56,119Z",
  "M61,56 L179,56 C248,56 283,95 283,153 C283,198 253,223 208,223 L149,223 L104,223 C70,223 46,198 46,159 C46,110 61,56 61,56Z",
  "M81,61 C119,46 173,46 213,61 L238,89 L253,143 L238,188 L213,208 C173,223 119,223 81,208 L56,188 L41,143 L56,89Z",
  "M61,143 C61,84 100,50 163,50 C213,50 253,74 263,113 L268,143 C268,198 228,223 174,223 L153,223 C100,223 61,198 61,143Z",
  "M51,66 L179,51 L278,104 L283,163 L244,208 L141,216 L66,183Z",
  "M81,56 L228,56 C263,56 283,80 283,129 C283,173 257,203 214,208 L153,213 L94,208 C65,203 48,176 51,139 C53,101 49,56 81,56Z",
  "M56,76 L99,41 L218,41 C258,41 283,70 283,114 L283,163 C283,198 258,218 224,218 L99,218 C66,218 46,196 46,163 L46,109Z",
  "M71,56 L198,56 C248,56 278,85 278,133 C278,183 253,213 213,213 L163,216 L113,213 C74,213 51,183 51,133 C51,94 71,56 71,56Z",
  "M56,139 C56,75 100,41 163,41 C208,41 246,65 263,104 L268,143 C268,198 228,223 173,223 L153,223 L128,220 C89,213 56,183 56,139Z",
  "M71,61 L198,51 C246,49 276,80 278,126 L278,160 C276,198 246,220 198,222 L118,222 C74,220 53,196 53,156 L53,108Z",
  "M61,148 C61,88 104,51 163,51 C208,51 244,72 258,107 L263,143 C266,190 236,218 188,220 L153,222 L124,220 C85,216 61,190 61,148Z",
  "M51,128 L84,51 L228,51 C266,51 288,78 288,119 L288,160 C288,196 263,216 226,216 L99,216 C68,216 49,193 51,153Z",
  "M66,138 C66,80 108,46 166,46 C218,46 256,78 263,126 L266,153 C266,203 233,226 183,226 L149,226 L124,223 C88,216 66,190 66,138Z",
  "M71,61 L213,56 C256,56 280,82 280,128 L280,163 C280,203 253,223 208,223 L128,223 C88,223 56,198 56,158 L56,113Z",
];

export default function CircuitsCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const c = circuits[idx];
  const path = TRACK_PATHS[idx] ?? TRACK_PATHS[0];

  const go = (d: number) => {
    setDir(d);
    setIdx(i => (i + d + circuits.length) % circuits.length);
  };

  const now = new Date();
  const raceDate = new Date(c.date);
  const status = raceDate < now ? "done" : idx === circuits.findIndex(r => new Date(r.date) > now) ? "next" : "upcoming";

  return (
    <section id="circuits" className="bg-[#0d0d0d] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white">2026 <span className="text-[#e10600]">Circuits</span></h2>
          <p className="text-zinc-500 text-sm mt-1">Click arrows to explore all {circuits.length} venues</p>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={idx}
            custom={dir}
            variants={{ enter: (d: number) => ({ opacity: 0, x: d * 60 }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -d * 60 }) }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-[#141414] border border-zinc-800 rounded-2xl p-6 grid md:grid-cols-2 gap-6 items-center">

            {/* SVG track */}
            <div className="bg-zinc-900 rounded-xl p-6 flex items-center justify-center min-h-[220px]">
              <svg viewBox="0 0 330 250" className="w-full max-h-[200px]" xmlns="http://www.w3.org/2000/svg">
                <text x="165" y="18" textAnchor="middle" fontSize="13" fill="#71717a" fontFamily="sans-serif">{c.flag} {c.country}</text>
                <path d={path} fill="none" stroke="#e10600" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity="0.12"/>
                <path d={path} fill="none" stroke="#e10600" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d={path} fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 8" opacity="0.15"/>
                <text x="165" y="240" textAnchor="middle" fontSize="9" fill="#52525b" fontFamily="sans-serif">Stylised · not to scale</text>
              </svg>
            </div>

            {/* Info */}
            <div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4
                ${status === "done" ? "bg-green-900/40 text-green-400" : status === "next" ? "bg-amber-900/40 text-amber-400" : "bg-zinc-800 text-zinc-400"}`}>
                {status === "done" ? "✓ Completed 2026" : status === "next" ? "→ Next Race" : "Upcoming"}
              </div>

              <h3 className="text-2xl font-black text-white leading-tight">{c.circuit}</h3>
              <p className="text-zinc-400 text-sm mt-1 mb-5">{c.flag} {c.country} · {c.name}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { l: "Laps",       v: c.laps },
                  { l: "Length",     v: c.length },
                  { l: "Turns",      v: c.turns },
                  { l: "Lap Record", v: c.record },
                  { l: "Type",       v: c.type },
                  { l: "Race Date",  v: raceDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                ].map(({ l, v }) => (
                  <div key={l} className="bg-zinc-900 rounded-xl p-3">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{l}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              {/* Nav */}
              <div className="flex items-center gap-3">
                <button onClick={() => go(-1)} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-[#e10600] text-white font-bold transition-all duration-200 flex items-center justify-center text-lg">‹</button>
                <span className="text-sm text-zinc-500">{idx + 1} / {circuits.length}</span>
                <button onClick={() => go(1)} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-[#e10600] text-white font-bold transition-all duration-200 flex items-center justify-center text-lg">›</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Flag dots */}
        <div className="flex flex-wrap gap-2 mt-5">
          {circuits.map((c2, i) => (
            <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className={`text-lg leading-none p-1 rounded transition-all ${i === idx ? "scale-125 opacity-100" : "opacity-40 hover:opacity-70"}`}>
              {c2.flag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
