"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { teams } from "@/data/teams";

export default function TeamsShowcase() {
  return (
    <section id="teams" className="bg-[#0d0d0d] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white">2026 <span className="text-[#e10600]">Teams</span></h2>
          <p className="text-zinc-500 text-sm mt-1">11 constructors · including Audi & Cadillac as new entries</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team,i)=>(
            <motion.div key={team.name}
              initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.06}}
              whileHover={{scale:1.02,y:-5}}
              className="bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden cursor-default"
              onMouseEnter={e=>(e.currentTarget.style.boxShadow=`0 0 32px ${team.color}35`)}
              onMouseLeave={e=>(e.currentTarget.style.boxShadow="")}>
              <div className="h-1" style={{background:team.color}}/>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                    <Image src={team.logo} alt={team.name} width={52} height={52} className="object-contain w-full h-full"/>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">{team.name}</h3>
                    {"isNew" in team && team.isNew && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:`${team.color}25`,color:team.color}}>NEW 2026</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  {[
                    {l:"Base",v:team.base},
                    {l:"Principal",v:team.principal},
                    {l:"Engine",v:team.engine},
                  ].map(({l,v})=>(
                    <div key={l} className="flex items-center justify-between">
                      <span className="text-zinc-500">{l}</span>
                      <span className="text-zinc-300 text-xs text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {team.drivers.map(d=>(
                    <span key={d} className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full">{d}</span>
                  ))}
                </div>
                <div className="h-0.5 mt-4 rounded-full opacity-30" style={{background:team.color}}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
