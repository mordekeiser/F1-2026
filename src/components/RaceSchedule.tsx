"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { type Race } from "@/lib/f1api";

const FLAG: Record<string,string> = {
  Australia:"🇦🇺",China:"🇨🇳",Japan:"🇯🇵",Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦","United States":"🇺🇸",
  Canada:"🇨🇦",Monaco:"🇲🇨",Spain:"🇪🇸",Austria:"🇦🇹","Great Britain":"🇬🇧",Belgium:"🇧🇪",
  Hungary:"🇭🇺",Netherlands:"🇳🇱",Italy:"🇮🇹",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",
  Brazil:"🇧🇷","Abu Dhabi":"🇦🇪",Qatar:"🇶🇦",
};

export default function RaceSchedule({ initial }: { initial: Race[] }) {
  const [races,setRaces]=useState(initial);
  useEffect(()=>{
    const refresh=async()=>{try{const res=await fetch("/api/f1?type=schedule");const data=await res.json();const r=data.MRData?.RaceTable?.Races;if(r?.length)setRaces(r);}catch{}};
    const id=setInterval(refresh,3_600_000);return()=>clearInterval(id);
  },[]);
  const now=new Date();
  const getStatus=(race:Race)=>{
    const rt=new Date(`${race.date}T${race.time??"14:00:00Z"}`);
    const diff=rt.getTime()-now.getTime();
    if(diff<-7200000)return"done";if(diff<7200000)return"live";if(diff<86400000*7)return"next";return"upcoming";
  };
  return (
    <section id="schedule" className="bg-[#0a0a0a] py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10"><h2 className="text-4xl font-black text-white">Race <span className="text-[#e10600]">Calendar</span></h2><p className="text-zinc-500 text-sm mt-1">2026 Formula 1 World Championship · {races.length} rounds</p></div>
        <div className="space-y-2">
          {races.map((race,i)=>{
            const status=getStatus(race);const flag=FLAG[race.Circuit.Location.country]??"🏁";
            const raceDate=new Date(`${race.date}T${race.time??"14:00:00Z"}`);
            const isLive=status==="live";const isDone=status==="done";const isNext=status==="next";
            return (
              <motion.div key={race.round} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.02}} whileHover={!isDone?{x:6}:{}}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${isLive?"border-[#e10600] bg-[#e10600]/8":isNext?"border-amber-500/40 bg-amber-500/5":isDone?"border-zinc-800/50 opacity-50":"border-zinc-800 hover:border-zinc-600"}`}>
                <span className="text-xs text-zinc-600 font-bold w-6 text-center">{race.round}</span>
                <span className="text-2xl flex-shrink-0">{flag}</span>
                <div className="flex-1 min-w-0"><div className={`font-bold text-sm truncate ${isLive?"text-white":"text-zinc-200"}`}>{race.raceName}</div><div className="text-xs text-zinc-500 truncate">{race.Circuit.circuitName}</div></div>
                <div className="text-xs text-zinc-500 hidden sm:block flex-shrink-0">{raceDate.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${isLive?"bg-[#e10600] text-white live-badge":isNext?"bg-amber-500/20 text-amber-400":isDone?"bg-zinc-800 text-zinc-500":"bg-zinc-800/50 text-zinc-600"}`}>
                  {isLive?"LIVE":isNext?"NEXT":isDone?"DONE":""}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
