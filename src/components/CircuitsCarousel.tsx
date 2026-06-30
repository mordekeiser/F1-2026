"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { circuits } from "@/data/circuits";

const CIRCUIT_META: Record<string, {
  drsZones: number;
  drsDesc: string[];
  sectors: { s1:[number,number]; s2:[number,number]; s3:[number,number] };
  startFinish: [number, number];
  topSpeed: string;
  downforce: "Low"|"Medium-Low"|"Medium"|"Medium-High"|"High";
}> = {
  albert_park:  { drsZones:4, drsDesc:["Main straight after Turn 16","Back straight after Turn 2","Turn 9–11","Turn 6"], sectors:{s1:[62,80],s2:[20,30],s3:[70,25]}, startFinish:[55,88], topSpeed:"328 km/h", downforce:"Medium" },
  shanghai:     { drsZones:2, drsDesc:["Main straight after Turn 16","Back straight after Turn 13"], sectors:{s1:[60,45],s2:[25,65],s3:[70,80]}, startFinish:[75,40], topSpeed:"327 km/h", downforce:"Medium" },
  suzuka:       { drsZones:2, drsDesc:["Main straight after final chicane","Back straight after Turn 7"], sectors:{s1:[55,35],s2:[20,70],s3:[70,70]}, startFinish:[62,28], topSpeed:"316 km/h", downforce:"High" },
  bahrain:      { drsZones:3, drsDesc:["Main straight","Turn 3–4 straight","Back straight Turn 14–15"], sectors:{s1:[65,30],s2:[20,60],s3:[60,75]}, startFinish:[70,25], topSpeed:"330 km/h", downforce:"Medium-High" },
  jeddah:       { drsZones:3, drsDesc:["Main straight","Turn 13–17 straight","Turn 26–27 straight"], sectors:{s1:[70,20],s2:[30,55],s3:[65,80]}, startFinish:[75,15], topSpeed:"350 km/h", downforce:"Low" },
  miami:        { drsZones:3, drsDesc:["Main straight","Turn 11–13","Turn 16–17"], sectors:{s1:[60,30],s2:[25,65],s3:[70,70]}, startFinish:[55,25], topSpeed:"320 km/h", downforce:"Medium" },
  montreal:     { drsZones:2, drsDesc:["Main straight","Back straight after Turn 8"], sectors:{s1:[55,25],s2:[25,60],s3:[65,75]}, startFinish:[60,20], topSpeed:"334 km/h", downforce:"Low" },
  monaco:       { drsZones:1, drsDesc:["Pit straight after Rascasse"], sectors:{s1:[60,55],s2:[25,35],s3:[50,80]}, startFinish:[55,70], topSpeed:"290 km/h", downforce:"High" },
  barcelona:    { drsZones:2, drsDesc:["Main straight after final chicane","Back straight after Turn 3"], sectors:{s1:[60,20],s2:[20,65],s3:[65,78]}, startFinish:[65,15], topSpeed:"328 km/h", downforce:"Medium-High" },
  austria:      { drsZones:3, drsDesc:["Main straight","Turn 3–4 run","Turn 9–10 approach"], sectors:{s1:[60,30],s2:[25,65],s3:[70,65]}, startFinish:[65,25], topSpeed:"329 km/h", downforce:"Medium-Low" },
  silverstone:  { drsZones:2, drsDesc:["Hangar straight after Stowe","Main Wellington straight"], sectors:{s1:[55,35],s2:[22,65],s3:[68,68]}, startFinish:[60,28], topSpeed:"330 km/h", downforce:"Medium-High" },
  spa:          { drsZones:2, drsDesc:["Kemmel straight after Raidillon","Main straight after Bus Stop"], sectors:{s1:[55,25],s2:[22,68],s3:[68,72]}, startFinish:[60,20], topSpeed:"355 km/h", downforce:"Low" },
  hungary:      { drsZones:2, drsDesc:["Main straight","Back straight after Turn 3"], sectors:{s1:[60,35],s2:[22,65],s3:[68,70]}, startFinish:[62,28], topSpeed:"305 km/h", downforce:"High" },
  zandvoort:    { drsZones:2, drsDesc:["Main straight","Approach to Tarzan hairpin"], sectors:{s1:[55,30],s2:[22,65],s3:[68,70]}, startFinish:[58,25], topSpeed:"309 km/h", downforce:"High" },
  monza:        { drsZones:3, drsDesc:["Main straight","Back straight","Second chicane approach"], sectors:{s1:[60,25],s2:[25,62],s3:[65,75]}, startFinish:[62,18], topSpeed:"370 km/h", downforce:"Low" },
  madrid:       { drsZones:3, drsDesc:["Main straight","Sector 2 long straight","Final approach"], sectors:{s1:[60,28],s2:[22,62],s3:[68,72]}, startFinish:[62,22], topSpeed:"340 km/h", downforce:"Medium" },
  baku:         { drsZones:2, drsDesc:["Main straight (2km)","Castle section approach"], sectors:{s1:[62,22],s2:[22,55],s3:[68,75]}, startFinish:[65,18], topSpeed:"360 km/h", downforce:"Low" },
  singapore:    { drsZones:3, drsDesc:["Main straight","Back straight Turn 5","Pit straight approach"], sectors:{s1:[60,30],s2:[22,62],s3:[68,72]}, startFinish:[62,25], topSpeed:"320 km/h", downforce:"High" },
  cota:         { drsZones:2, drsDesc:["Main straight after Turn 20","Back straight after Turn 11"], sectors:{s1:[62,18],s2:[25,62],s3:[68,75]}, startFinish:[65,12], topSpeed:"333 km/h", downforce:"Medium-High" },
  mexico:       { drsZones:3, drsDesc:["Main straight","Turn 1–2 approach","Stadium section"], sectors:{s1:[65,18],s2:[22,65],s3:[68,78]}, startFinish:[68,12], topSpeed:"358 km/h", downforce:"Low" },
  brazil:       { drsZones:2, drsDesc:["Main straight","Back straight after Senna S"], sectors:{s1:[58,22],s2:[22,62],s3:[68,72]}, startFinish:[60,16], topSpeed:"335 km/h", downforce:"Medium" },
  las_vegas:    { drsZones:2, drsDesc:["Las Vegas Blvd straight","Koval Lane straight"], sectors:{s1:[62,20],s2:[22,60],s3:[68,72]}, startFinish:[65,15], topSpeed:"350 km/h", downforce:"Low" },
  qatar:        { drsZones:2, drsDesc:["Main straight","Back straight"], sectors:{s1:[60,22],s2:[22,65],s3:[68,75]}, startFinish:[62,16], topSpeed:"322 km/h", downforce:"High" },
  abu_dhabi:    { drsZones:3, drsDesc:["Main straight","Turn 7–9 straight","Marina section"], sectors:{s1:[62,22],s2:[22,62],s3:[68,72]}, startFinish:[65,16], topSpeed:"330 km/h", downforce:"Medium" },
};

const CIRCUIT_KEYS = [
  "albert_park","shanghai","suzuka","bahrain","jeddah","miami","montreal",
  "monaco","barcelona","austria","silverstone","spa","hungary","zandvoort",
  "monza","madrid","baku","singapore","cota","mexico","brazil",
  "las_vegas","qatar","abu_dhabi",
];

const DOWNFORCE_COLOR: Record<string,string> = {
  "Low":"#e10600","Medium-Low":"#ff8000","Medium":"#ffb300","Medium-High":"#66bb6a","High":"#42a5f5",
};
const SECTOR_COLORS = { s1:"#e10600", s2:"#ffb300", s3:"#42a5f5" };

function SectorPin({ x, y, label, color }: { x:number; y:number; label:string; color:string }) {
  return (
    <g transform={`translate(${x*5},${y*5})`}>
      <circle r="11" fill={color} opacity="0.92"/>
      <circle r="11" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
      <text textAnchor="middle" y="4" fontSize="9" fontWeight="bold" fill="white" fontFamily="Arial">{label}</text>
    </g>
  );
}
function StartPin({ x, y }: { x:number; y:number }) {
  return (
    <g transform={`translate(${x*5},${y*5})`}>
      <rect x="-9" y="-9" width="18" height="18" fill="white" rx="2" opacity="0.95"/>
      <rect x="-9" y="-9" width="9" height="9" fill="black"/>
      <rect x="0" y="0" width="9" height="9" fill="black"/>
    </g>
  );
}

export default function CircuitsCarousel() {
  const [idx,setIdx]=useState(0);
  const [dir,setDir]=useState(1);
  const [svgContent,setSvgContent]=useState("");
  const [loading,setLoading]=useState(false);

  const key = CIRCUIT_KEYS[idx];
  const meta = CIRCUIT_META[key];
  const c = circuits[idx];

  useEffect(()=>{
    setLoading(true);
    fetch(`/circuits/${key}.svg`)
      .then(r=>r.text())
      .then(text=>{
        const match = text.match(/d="([^"]+)"/);
        if(match) setSvgContent(match[1]);
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  },[key]);

  const go=(d:number)=>{setDir(d);setIdx(i=>(i+d+CIRCUIT_KEYS.length)%CIRCUIT_KEYS.length);};

  const now=new Date();
  const raceDate=new Date(c.date);
  const nextIdx=circuits.findIndex(r=>new Date(r.date)>now);
  const status = raceDate<now ? "done" : idx===nextIdx ? "next" : "upcoming";
  const dfColor = DOWNFORCE_COLOR[meta?.downforce ?? "Medium"];

  return (
    <section id="circuits" className="bg-[#0d0d0d] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white">2026 <span className="text-[#e10600]">Circuits</span></h2>
          <p className="text-zinc-500 text-sm mt-1">Real track layouts · DRS zones · Sector markers · {circuits.length} venues</p>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={idx} custom={dir}
            variants={{enter:(d:number)=>({opacity:0,x:d*80}),center:{opacity:1,x:0},exit:(d:number)=>({opacity:0,x:-d*80})}}
            initial="enter" animate="center" exit="exit" transition={{duration:0.3,ease:"easeInOut"}}
            className="grid md:grid-cols-5 gap-6">

            <div className="md:col-span-3 bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <div className="text-white font-black text-lg leading-tight">{c.circuit}</div>
                    <div className="text-zinc-500 text-xs">{c.name} · Round {c.round}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${status==="done"?"bg-green-900/40 text-green-400":status==="next"?"bg-amber-900/40 text-amber-400":"bg-zinc-800 text-zinc-400"}`}>
                  {status==="done"?"✓ Completed":status==="next"?"→ Next":"Upcoming"}
                </span>
              </div>

              <div className="flex-1 bg-zinc-900 rounded-xl flex items-center justify-center p-4 min-h-[280px] relative overflow-hidden">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#e10600] border-t-transparent rounded-full animate-spin"/>
                    <span className="text-zinc-500 text-xs">Loading track layout...</span>
                  </div>
                ) : svgContent ? (
                  <svg viewBox="0 0 500 500" className="w-full max-h-[280px]" xmlns="http://www.w3.org/2000/svg">
                    <path d={svgContent} fill="none" stroke="#e10600" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.08"/>
                    <path d={svgContent} fill="none" stroke="#e8e8e8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d={svgContent} fill="none" stroke="#e10600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 6" opacity="0.6"/>
                    {meta && <>
                      <SectorPin x={meta.sectors.s1[0]} y={meta.sectors.s1[1]} label="S1" color={SECTOR_COLORS.s1}/>
                      <SectorPin x={meta.sectors.s2[0]} y={meta.sectors.s2[1]} label="S2" color={SECTOR_COLORS.s2}/>
                      <SectorPin x={meta.sectors.s3[0]} y={meta.sectors.s3[1]} label="S3" color={SECTOR_COLORS.s3}/>
                      <StartPin x={meta.startFinish[0]} y={meta.startFinish[1]}/>
                    </>}
                  </svg>
                ) : (
                  <span className="text-zinc-600 text-sm">Track layout unavailable</span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5"><div className="w-6 h-1 bg-zinc-300 rounded"/><span className="text-xs text-zinc-500">Track</span></div>
                {[{color:SECTOR_COLORS.s1,label:"Sector 1"},{color:SECTOR_COLORS.s2,label:"Sector 2"},{color:SECTOR_COLORS.s3,label:"Sector 3"}].map(({color,label})=>(
                  <div key={label} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{background:color}}/><span className="text-xs text-zinc-500">{label}</span></div>
                ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 grid grid-cols-2 gap-px opacity-80">
                    <div className="bg-white rounded-sm"/><div className="bg-black rounded-sm border border-zinc-600"/>
                    <div className="bg-black rounded-sm border border-zinc-600"/><div className="bg-white rounded-sm"/>
                  </div>
                  <span className="text-xs text-zinc-500">Start/Finish</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {l:"Laps",v:String(c.laps)},{l:"Length",v:c.length},{l:"Turns",v:String(c.turns)},
                  {l:"Lap Record",v:c.record},{l:"Top Speed",v:meta?.topSpeed??"—"},{l:"Circuit Type",v:c.type},
                ].map(({l,v})=>(
                  <div key={l} className="bg-[#141414] border border-zinc-800 rounded-xl p-3">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{l}</div>
                    <div className="text-sm font-bold text-white mt-0.5 leading-tight">{v}</div>
                  </div>
                ))}
              </div>

              {meta && (
                <div className="bg-[#141414] border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Downforce Level</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:{"Low":"20%","Medium-Low":"40%","Medium":"60%","Medium-High":"80%","High":"100%"}[meta.downforce]}} transition={{duration:0.8}} className="h-full rounded-full" style={{background:dfColor}}/>
                    </div>
                    <span className="text-sm font-bold" style={{color:dfColor}}>{meta.downforce}</span>
                  </div>
                </div>
              )}

              {meta && (
                <div className="bg-[#141414] border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">DRS Zones</div>
                    <span className="text-xs font-black text-[#e10600] bg-[#e10600]/10 px-2 py-0.5 rounded-full">{meta.drsZones} zones</span>
                  </div>
                  <div className="space-y-2">
                    {meta.drsDesc.map((desc,i)=>(
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#e10600]/20 border border-[#e10600]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-black text-[#e10600]">{i+1}</span>
                        </div>
                        <span className="text-xs text-zinc-400 leading-tight">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#141414] border border-zinc-800 rounded-xl p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Race Date</div>
                <div className="text-sm font-bold text-white">{raceDate.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={()=>go(-1)} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-[#e10600] text-white font-bold transition-all flex items-center justify-center text-xl">‹</button>
                <span className="text-sm text-zinc-500 flex-1 text-center">{idx+1} / {CIRCUIT_KEYS.length}</span>
                <button onClick={()=>go(1)} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-[#e10600] text-white font-bold transition-all flex items-center justify-center text-xl">›</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-2 mt-8">
          {circuits.map((c2,i)=>(
            <button key={i} onClick={()=>{setDir(i>idx?1:-1);setIdx(i);}}
              className={`text-xl leading-none p-1.5 rounded-lg transition-all ${i===idx?"scale-125 bg-[#e10600]/20 border border-[#e10600]/40":"opacity-40 hover:opacity-80 hover:bg-white/5"}`}>
              {c2.flag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
