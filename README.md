# F1 Nexus 2026

Full Formula 1 2026 season website — Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion.

## Features
- Live driver & constructor standings (Jolpica API, refreshes every 5 min)
- Race schedule with live/next/done status
- Live countdown to next race
- **Real circuit layouts** (not abstract shapes) sourced from f1-circuits-svg (CC-BY-4.0), with DRS zone markers, sector 1/2/3 pins, and start/finish line
- Driver grid with click-to-expand profiles
- Teams page with real logos
- Last race podium + top 10 results, auto-refreshing

## Setup
```bash
npm install
npm run dev
```

## Deploy
Push to GitHub, import into Vercel, deploy.

## Credits
- Live data: [Jolpica F1 API](https://api.jolpi.ca)
- Circuit layouts: [f1-circuits-svg](https://github.com/julesr0y/f1-circuits-svg) (CC-BY-4.0)
