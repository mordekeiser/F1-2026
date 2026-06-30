"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Countdown({ targetDate }: { targetDate: string }) {
  const [t,setT]=useState({d:0,h:0,m:0,s:0});
  useEffect(()=>{
    const tick=()=>{
      const diff=new Date(targetDate).getTime()-Date.now();
      if(diff<=0){setT({d:0,h:0,m:0,s:0});return;}
      setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)});
    };
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[targetDate]);
  const pad=(n:number)=>String(n).padStart(2,"0");
  return (
    <div className="flex gap-3">
      {[{v:t.d,l:"DAYS"},{v:t.h,l:"HRS"},{v:t.m,l:"MIN"},{v:t.s,l:"SEC"}].map(({v,l})=>(
        <div key={l} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[64px]">
          <span className="text-3xl font-black text-[#e10600] tabular-nums">{pad(v)}</span>
          <span className="text-xs text-zinc-500 font-semibold mt-1 tracking-widest">{l}</span>
        </div>
      ))}
    </div>
  );
}

interface HeroProps { nextRaceName:string; nextRaceDate:string; nextRaceFlag:string; leaderName:string; leaderPts:string; leaderTeam:string; }

export default function Hero({nextRaceName,nextRaceDate,nextRaceFlag,leaderName,leaderPts,leaderTeam}:HeroProps) {
  return (
    <section id="home" className="relative min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden pt-16">
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50px)"}}/>
      {[38,52,65].map((top,i)=>(
        <div key={i} className="speed-line" style={{top:`${top}%`,animationDelay:`${i*0.7}s`,opacity:0.4+i*0.15}}/>
      ))}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
          className="inline-flex items-center gap-2 bg-[#e10600]/10 border border-[#e10600]/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#e10600] live-badge"/>
          <span className="text-[#e10600] text-xs font-bold tracking-widest uppercase">2026 World Championship · Live Data</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
          className="text-[clamp(52px,12vw,120px)] font-black text-white leading-none tracking-tight">
          F1<span className="text-[#e10600]">NEXUS</span>
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5,duration:0.7}}
          className="text-zinc-400 text-lg mt-4 mb-12 tracking-widest uppercase font-medium">
          Formula One Analytics Platform
        </motion.p>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.7,duration:0.6}}
          className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            {label:"Championship Leader",value:leaderName,sub:`${leaderPts} pts · ${leaderTeam}`,color:"#00D2BE"},
            {label:"Rounds Completed",value:"6 / 24",sub:"Season in progress",color:"#e10600"},
            {label:"Teams on Grid",value:"11",sub:"inc. Audi & Cadillac",color:"#FF8000"},
          ].map(({label,value,sub,color})=>(
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[160px]">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
              <div className="text-xl font-black" style={{color}}>{value}</div>
              <div className="text-xs text-zinc-500 mt-1">{sub}</div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.9,duration:0.6}} className="flex flex-col items-center gap-4">
          <div className="text-sm text-zinc-400 uppercase tracking-widest font-medium">{nextRaceFlag} Next Race — {nextRaceName}</div>
          <Countdown targetDate={nextRaceDate}/>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}} className="flex gap-4 justify-center mt-10 flex-wrap">
          <a href="#standings" className="px-8 py-3 bg-[#e10600] hover:bg-[#c00500] text-white font-bold rounded-xl transition-all hover:scale-105 text-sm uppercase tracking-wider">View Standings</a>
          <a href="#circuits"  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all hover:scale-105 text-sm uppercase tracking-wider">Explore Circuits</a>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"/>
    </section>
  );
}
