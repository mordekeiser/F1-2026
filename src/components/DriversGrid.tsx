"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getTeamColor, getNationality, type DriverStanding } from "@/lib/f1api";

export default function DriversGrid({ drivers }: { drivers: DriverStanding[] }) {
  const [selected, setSelected] = useState<DriverStanding | null>(null);

  return (
    <section id="drivers" className="bg-[#0a0a0a] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white">2026 <span className="text-[#e10600]">Drivers</span></h2>
          <p className="text-zinc-500 text-sm mt-1">Click any driver for full profile</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {drivers.map((d, i) => {
            const name = `${d.Driver.givenName} ${d.Driver.familyName}`;
            const team = d.Constructors[0]?.name ?? "";
            const color = getTeamColor(team);
            const flag = getNationality(d.Driver.nationality);
            const medalClass = d.position === "1" ? "bg-yellow-400 text-black" : d.position === "2" ? "bg-zinc-300 text-black" : d.position === "3" ? "bg-amber-600 text-white" : "bg-zinc-800 text-zinc-400";

            return (
              <motion.button key={d.Driver.driverId}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                whileHover={{ y: -6, scale: 1.03 }}
                onClick={() => setSelected(d)}
                className="relative bg-[#141414] border border-zinc-800 rounded-2xl p-4 text-left overflow-hidden cursor-pointer group"
                style={{ "--tc": color } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#3f3f46")}>

                {/* Team color top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: color }} />

                {/* Big number bg */}
                <div className="absolute right-2 top-2 text-4xl font-black opacity-10 leading-none" style={{ color }}>
                  {d.Driver.permanentNumber}
                </div>

                <div className="text-xl mb-2">{flag}</div>
                <div className="font-black text-white text-sm leading-tight mb-0.5">{d.Driver.givenName}</div>
                <div className="font-black text-white text-sm leading-tight mb-3">{d.Driver.familyName}</div>
                <div className="text-xs text-zinc-500 mb-3 truncate">{team}</div>

                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${medalClass}`}>
                    {d.position}
                  </span>
                  <span className="text-sm font-black" style={{ color }}>{d.points}pts</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Driver modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#141414] border border-zinc-700 rounded-3xl p-8 max-w-md w-full relative overflow-hidden">

              {(() => {
                const team = selected.Constructors[0]?.name ?? "";
                const color = getTeamColor(team);
                const flag = getNationality(selected.Driver.nationality);
                return (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: color }} />
                    <div className="absolute right-6 top-6 text-8xl font-black opacity-[0.07] leading-none" style={{ color }}>
                      {selected.Driver.permanentNumber}
                    </div>

                    <button onClick={() => setSelected(null)}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#e10600] text-white text-sm flex items-center justify-center transition-colors">
                      ✕
                    </button>

                    <div className="text-3xl mb-3">{flag}</div>
                    <h3 className="text-2xl font-black text-white">
                      {selected.Driver.givenName} {selected.Driver.familyName}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1 mb-6">{team} · Car #{selected.Driver.permanentNumber}</p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { l: "Points",   v: selected.points,                          color },
                        { l: "Wins",     v: selected.wins,                            color: "#4ade80" },
                        { l: "Position", v: `P${selected.position}`,                 color: "#facc15" },
                      ].map(({ l, v, color: c }) => (
                        <div key={l} className="bg-zinc-900 rounded-2xl p-3 text-center">
                          <div className="text-xl font-black" style={{ color: c }}>{v}</div>
                          <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{l}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-sm text-zinc-400">
                      <div className="flex justify-between"><span>Nationality</span><span className="text-white">{selected.Driver.nationality}</span></div>
                      <div className="flex justify-between"><span>Date of Birth</span><span className="text-white">{new Date(selected.Driver.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span></div>
                      <div className="flex justify-between"><span>Constructor</span><span className="text-white">{team}</span></div>
                    </div>

                    <div className="mt-5 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(Number(selected.points) / 131) * 100}%`, background: color }} />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600 mt-1">
                      <span>{selected.points} pts</span><span>Leader</span>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
