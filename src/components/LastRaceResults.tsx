"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTeamColor, type Race } from "@/lib/f1api";

const FLAG: Record<string,string> = {
  Australia:"🇦🇺",China:"🇨🇳",Japan:"🇯🇵",Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦","United States":"🇺🇸",
  Canada:"🇨🇦",Monaco:"🇲🇨",Spain:"🇪🇸",Austria:"🇦🇹","Great Britain":"🇬🇧",Belgium:"🇧🇪",
  Hungary:"🇭🇺",Netherlands:"🇳🇱",Italy:"🇮🇹",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",
  Brazil:"🇧🇷","Abu Dhabi":"🇦🇪",Qatar:"🇶🇦",
};

export default function LastRaceResults({ initial }: { initial: Race | null }) {
  const [race,setRace]=useState(initial);
  useEffect(()=>{
    const refresh=async()=>{try{const res=await fetch("/api/f1?type=lastrace");const data=await res.json();const r=data.MRData?.RaceTable?.Races?.[0];if(r)setRace(r);}catch{}};
    const id=setInterval(refresh,300_000);return()=>clearInterval(id);
  },[]);
  if(!race||!race.Results?.length) return null;
  const flag=FLAG[race.Circuit.Location.country]??"🏁";
  return (
    <section id="results" className="bg-[#0a0a0a] py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-white">Last <span className="text-[#e10600]">Race</span></h2>
          <p className="text-zinc-500 text-sm mt-1">{flag} Round {race.round} · {race.raceName} · {new Date(race.date).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {pos:"2",result:race.Results[1],emoji:"🥈",medal:"bg-zinc-300 text-black"},
            {pos:"1",result:race.Results[0],emoji:"🥇",medal:"bg-yellow-400 text-black"},
            {pos:"3",result:race.Results[2],emoji:"🥉",medal:"bg-amber-600 text-white"},
          ].map(({pos,result,emoji,medal})=>{
            if(!result) return null;
            const color=getTeamColor(result.Constructor.name);
            return (
              <motion.div key={pos} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:Number(pos)*0.1}}
                className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 text-center"
                onMouseEnter={e=>(e.currentTarget.style.boxShadow=`0 0 20px ${color}30`)} onMouseLeave={e=>(e.currentTarget.style.boxShadow="")}>
                <div className="text-3xl mb-2">{emoji}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-2 ${medal}`}>{pos}</div>
                <div className="font-black text-white text-sm leading-tight">{result.Driver.givenName}</div>
                <div className="font-black text-white text-sm leading-tight mb-1">{result.Driver.familyName}</div>
                <div className="text-xs text-zinc-500">{result.Constructor.name}</div>
                <div className="text-sm font-bold mt-2" style={{color}}>{result.points} pts</div>
              </motion.div>
            );
          })}
        </div>
        <div className="space-y-2">
          {race.Results.slice(0,10).map((r,i)=>{
            const color=getTeamColor(r.Constructor.name);
            return (
              <motion.div key={r.position} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.04}}
                className="flex items-center gap-4 bg-[#141414] border border-zinc-800 rounded-xl px-4 py-3">
                <span className="text-sm font-black text-zinc-500 w-5 text-center">P{r.position}</span>
                <div className="flex-1"><div className="text-sm font-bold text-white">{r.Driver.givenName} {r.Driver.familyName}</div><div className="text-xs text-zinc-500">{r.Constructor.name}</div></div>
                <div className="text-sm font-black" style={{color}}>{r.points} pts</div>
                {r.FastestLap?.rank==="1"&&<span className="text-xs bg-purple-900/40 text-purple-400 px-2 py-0.5 rounded-full font-bold">⚡ FL</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
