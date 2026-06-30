"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTeamColor, getNationality, type DriverStanding } from "@/lib/f1api";

export default function DriverStandings({ initial }: { initial: DriverStanding[] }) {
  const [drivers,setDrivers]=useState(initial);
  const [lastUpdated,setLastUpdated]=useState<Date|null>(null);
  const maxPts=drivers.length?Number(drivers[0].points):1;
  useEffect(()=>{
    setLastUpdated(new Date());
    const refresh=async()=>{
      try{const res=await fetch("/api/f1?type=drivers");const data=await res.json();const s=data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;if(s?.length){setDrivers(s);setLastUpdated(new Date());}}catch{}
    };
    const id=setInterval(refresh,300_000);return()=>clearInterval(id);
  },[]);
  const medalClass=(p:string)=>p==="1"?"bg-yellow-400 text-black":p==="2"?"bg-zinc-300 text-black":p==="3"?"bg-amber-600 text-white":"bg-zinc-800 text-zinc-400";
  return (
    <section id="standings" className="bg-[#0a0a0a] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black text-white">Driver <span className="text-[#e10600]">Championship</span></h2>
            <p className="text-zinc-500 text-sm mt-1" suppressHydrationWarning>
              Live · refreshes every 5 min{lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ""}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {drivers.map((d,i)=>{
            const name=`${d.Driver.givenName} ${d.Driver.familyName}`;
            const team=d.Constructors[0]?.name??"";
            const color=getTeamColor(team);
            const flag=getNationality(d.Driver.nationality);
            const pct=(Number(d.points)/maxPts)*100;
            return (
              <motion.div key={d.Driver.driverId} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.04}} whileHover={{scale:1.015,x:4}}
                className="relative group bg-[#141414] border border-zinc-800 rounded-2xl p-4 overflow-hidden"
                onMouseEnter={e=>(e.currentTarget.style.boxShadow=`0 0 20px ${color}30`)}
                onMouseLeave={e=>(e.currentTarget.style.boxShadow="")}>
                <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{background:color}}/>
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${medalClass(d.position)}`}>{d.position}</span>
                  <div className="text-base font-black text-white flex-1">{flag} {name}
                    {d.position==="1"&&<span className="ml-2 text-xs bg-[#e10600]/20 text-[#e10600] px-2 py-0.5 rounded-full font-bold">LEADER</span>}
                  </div>
                  <div className="text-right hidden sm:block"><div className="text-xs text-zinc-500">{team}</div><div className="text-xs text-zinc-600">{d.wins}W</div></div>
                  <div className="text-xl font-black" style={{color}}>{d.points}<span className="text-sm font-normal text-zinc-500 ml-1">pts</span></div>
                </div>
                <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} whileInView={{width:`${pct}%`}} viewport={{once:true}} transition={{duration:1.2,delay:i*0.04}} className="h-full rounded-full" style={{backgroundColor:color}}/>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
