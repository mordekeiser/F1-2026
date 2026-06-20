# F1 Nexus 2026

A full Formula 1 2026 season website built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

## Features

- **Live standings** — Driver & Constructor championships via Jolpica API (updates every 5 min)
- **Race schedule** — Full 2026 calendar with live/next/done status
- **Countdown timer** — Live countdown to the next race, auto-updates when race changes
- **Circuits carousel** — All 24 circuits with animated slide transitions
- **Drivers grid** — All 22 drivers with click-to-expand profile modals
- **Teams page** — All 11 teams including new Audi & Cadillac with logos
- **Last race results** — Live top-10 with podium display, auto-refreshes
- **Framer Motion animations** — Smooth page transitions and hover effects
- **Responsive** — Works on mobile, tablet, desktop

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (free)

1. Push to GitHub
2. Go to vercel.com → New Project → import your repo
3. Deploy — live in 60 seconds at `your-project.vercel.app`

## Data source

All live data from [Jolpica F1 API](https://api.jolpi.ca) — free, no API key needed.
Data revalidates every 5 minutes via Next.js ISR (Incremental Static Regeneration).

## Adding team logos

Place PNG files in `/public/teams/`:
- mclaren.png, ferrari.png, mercedes.png, redbull.png
- williams.png, haas.png, alpine.png, aston.png
- audi.png, rb.png, cadillac.png

Official logos can be downloaded from each team's press kit / media centre.
