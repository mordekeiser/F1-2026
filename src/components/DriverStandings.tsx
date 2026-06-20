"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTeamColor, getNationality, type DriverStanding } from "@/lib/f1api";
import CountUp from "react-countup";

export default function DriverStandings({ initial }: { initial: DriverStanding[] }) {
  const [drivers, setDrivers] = useState<DriverStanding[]>(initial);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Refresh every 5 minutes live
  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/f1?type=drivers");
        const data = await res.json();
        const standings = data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
        if (standings?.length) { setDrivers(standings); setLastUpdated(new Date()); }
      } catch {}
      setLoading(false);
    };
    const id = setInterval(refresh, 300_000);
    return () => clearInterval(id);
  }, []);

  const maxPts = drivers.length ? Number(drivers[0].points) : 1;

  const medalClass = (pos: string) => {
    if (pos === "1") return "bg-yellow-400 text-black";
    if (pos === "2") return "bg-zinc-300 text-black";
    if (pos === "3") return "bg-amber-600 text-white";
    return "bg-zinc-800 text-zinc-400";
  };

  return (
    <section id="standings" className="bg-[#0a0a0a] py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black text-white">Driver <span className="text-[#e10600]">Championship</span></h2>
            <p className="text-zinc-500 text-sm mt-1">Live data · updates every 5 min</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {loading && <span className="w-2 h-2 rounded-full bg-[#e10600] live-badge" />}
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          {drivers.map((d, i) => {
            const name = `${d.Driver.givenName} ${d.Driver.familyName}`;
            const team = d.Constructors[0]?.name ?? "";
            const color = getTeamColor(team);
            const flag = getNationality(d.Driver.nationality);
            const pct = (Number(d.points) / maxPts) * 100;

            return (
              <motion.div key={d.Driver.driverId}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ scale: 1.015, x: 4 }}
                className="group bg-[#141414] border border-zinc-800 rounded-2xl p-4 cursor-default transition-all duration-200"
                style={{ boxShadow: "0 0 0px transparent" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px ${color}30`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0px transparent")}>

                {/* Top row */}
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${medalClass(d.position)}`}>
                    {d.position}
                  </span>

                  <div className="text-lg font-black text-white leading-tight">
                    {flag} {name}
                    {d.position === "1" && <span className="ml-2 text-xs bg-[#e10600]/20 text-[#e10600] px-2 py-0.5 rounded-full font-bold">LEADER</span>}
                  </div>

                  <div className="ml-auto flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-zinc-500">{team}</div>
                      <div className="text-xs text-zinc-600">{d.wins} win{Number(d.wins) !== 1 ? "s" : ""}</div>
                    </div>
                    <div className="text-xl font-black" style={{ color }}>
                      <CountUp end={Number(d.points)} duration={1.5} preserveValue />
                      <span className="text-sm font-normal text-zinc-500 ml-1">pts</span>
                    </div>
                  </div>
                </div>

                {/* Bar */}
                <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.04 }}
                    className="h-full rounded-full" style={{ backgroundColor: color }} />
                </div>

                {/* Team color accent */}
                <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
