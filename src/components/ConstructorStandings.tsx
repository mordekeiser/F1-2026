"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getTeamColor, type ConstructorStanding } from "@/lib/f1api";

const LOGOS: Record<string,string> = {
  McLaren:"/teams/mclaren.png",Ferrari:"/teams/ferrari.png",Mercedes:"/teams/mercedes.png",
  "Red Bull":"/teams/redbull.png",Williams:"/teams/williams.png","Haas F1 Team":"/teams/haas.png",
  "Alpine F1 Team":"/teams/alpine.png","Aston Martin":"/teams/aston.png",
  Audi:"/teams/audi.png","RB F1 Team":"/teams/rb.png","Cadillac Racing":"/teams/cadillac.png",
};

export default function ConstructorStandings({ initial }: { initial: ConstructorStanding[] }) {
  const [teams,setTeams]=useState(initial);
  const [lastUpdated,setLastUpdated]=useState<Date|null>(null);
  const maxPts=teams.length?Number(teams[0].points):1;
  useEffect(()=>{
    setLastUpdated(new Date());
    const refresh=async()=>{
      try{const res=await fetch("/api/f1?type=constructors");const data=await res.json();const s=data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;if(s?.length){setTeams(s);setLastUpdated(new Date());}}catch{}
    };
    const id=setInterval(refresh,300_000);return()=>clearInterval(id);
  },[]);
  const medalClass=(p:string)=>p==="1"?"bg-yellow-400 text-black":p==="2"?"bg-zinc-300 text-black":p==="3"?"bg-amber-600 text-white":"bg-zinc-800 text-zinc-400";
  return (
    <section className="bg-[#0d0d0d] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white">Constructor <span className="text-[#e10600]">Championship</span></h2>
          <p className="text-zinc-500 text-sm mt-1" suppressHydrationWarning>
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Live standings"}
          </p>
        </div>
        <div className="space-y-4">
          {teams.map((t,i)=>{
            const name=t.Constructor.name;const color=getTeamColor(name);const logo=LOGOS[name];const pct=(Number(t.points)/maxPts)*100;
            return (
              <motion.div key={t.Constructor.constructorId} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} whileHover={{scale:1.02,y:-3}}
                className="bg-[#141414] border border-zinc-800 rounded-2xl p-5"
                onMouseEnter={e=>(e.currentTarget.style.boxShadow=`0 0 28px ${color}40`)}
                onMouseLeave={e=>(e.currentTarget.style.boxShadow="")}>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${medalClass(t.position)}`}>{t.position}</span>
                  {logo&&<div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center p-1.5 flex-shrink-0"><Image src={logo} alt={name} width={36} height={36} className="object-contain w-full h-full"/></div>}
                  <div className="flex-1"><div className="text-lg font-black text-white">{name}</div><div className="text-xs text-zinc-500">{t.wins} wins</div></div>
                  <div className="text-2xl font-black" style={{color}}>{t.points}<span className="text-sm font-normal text-zinc-500 ml-1">pts</span></div>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} whileInView={{width:`${pct}%`}} viewport={{once:true}} transition={{duration:1.5,delay:i*0.05}} className="h-full rounded-full" style={{backgroundColor:color}}/>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
