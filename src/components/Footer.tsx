export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="text-[#e10600] font-black text-lg">F1</span>
          <span className="text-white font-bold">NEXUS</span>
          <span className="text-zinc-700">· 2026 Season</span>
        </div>
        <div className="text-center text-xs">
          Live data via <a href="https://api.jolpi.ca" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Jolpica F1 API</a>
          {" "}· Updates every 5 minutes after race weekends
        </div>
        <div className="text-xs text-zinc-700">Built with Next.js · F1 Nexus</div>
      </div>
    </footer>
  );
}
