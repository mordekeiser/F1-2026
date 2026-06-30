import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RaceSchedule from "@/components/RaceSchedule";
import DriverStandings from "@/components/DriverStandings";
import ConstructorStandings from "@/components/ConstructorStandings";
import CircuitsCarousel from "@/components/CircuitsCarousel";
import DriversGrid from "@/components/DriversGrid";
import TeamsShowcase from "@/components/TeamsShowcase";
import LastRaceResults from "@/components/LastRaceResults";
import Footer from "@/components/Footer";
import { getDriverStandings, getConstructorStandings, getRaceSchedule, getLastRaceResults, getNextRace } from "@/lib/f1api";
import { circuits } from "@/data/circuits";

export const revalidate = 300;

const FLAG_MAP: Record<string,string> = {
  Australia:"🇦🇺",China:"🇨🇳",Japan:"🇯🇵",Bahrain:"🇧🇭","Saudi Arabia":"🇸🇦","United States":"🇺🇸",
  Canada:"🇨🇦",Monaco:"🇲🇨",Spain:"🇪🇸",Austria:"🇦🇹","Great Britain":"🇬🇧",Belgium:"🇧🇪",
  Hungary:"🇭🇺",Netherlands:"🇳🇱",Italy:"🇮🇹",Azerbaijan:"🇦🇿",Singapore:"🇸🇬",Mexico:"🇲🇽",
  Brazil:"🇧🇷","Abu Dhabi":"🇦🇪",Qatar:"🇶🇦",
};

export default async function Home() {
  const [driverStandings, constructorStandings, schedule, lastRace] = await Promise.all([
    getDriverStandings(), getConstructorStandings(), getRaceSchedule(), getLastRaceResults(),
  ]);

  const nextRaceFromAPI = getNextRace(schedule);
  const now = new Date();
  let nextRaceName = "Spanish GP", nextRaceDate = "2026-06-14T13:00:00Z", nextRaceFlag = "🇪🇸";

  if (nextRaceFromAPI) {
    nextRaceName = nextRaceFromAPI.raceName;
    nextRaceDate = `${nextRaceFromAPI.date}T${nextRaceFromAPI.time ?? "13:00:00Z"}`;
    nextRaceFlag = FLAG_MAP[nextRaceFromAPI.Circuit.Location.country] ?? "🏁";
  } else {
    const nextLocal = circuits.find(c => new Date(c.date) > now);
    if (nextLocal) { nextRaceName = nextLocal.name; nextRaceDate = `${nextLocal.date}T13:00:00Z`; nextRaceFlag = nextLocal.flag; }
  }

  const leader = driverStandings[0];
  const leaderName = leader ? `${leader.Driver.givenName} ${leader.Driver.familyName}` : "Kimi Antonelli";
  const leaderPts = leader?.points ?? "131";
  const leaderTeam = leader?.Constructors?.[0]?.name ?? "Mercedes";

  return (
    <>
      <Navbar/>
      <Hero nextRaceName={nextRaceName} nextRaceDate={nextRaceDate} nextRaceFlag={nextRaceFlag} leaderName={leaderName} leaderPts={leaderPts} leaderTeam={leaderTeam}/>
      <RaceSchedule initial={schedule}/>
      <DriverStandings initial={driverStandings}/>
      <ConstructorStandings initial={constructorStandings}/>
      <CircuitsCarousel/>
      <DriversGrid drivers={driverStandings}/>
      <TeamsShowcase/>
      <LastRaceResults initial={lastRace}/>
      <Footer/>
      <SpeedInsights/>
    </>
  );
}
