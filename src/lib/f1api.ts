const BASE = "https://api.jolpi.ca/ergast/f1";

export interface DriverStanding {
  position: string; points: string; wins: string;
  Driver: { driverId: string; permanentNumber: string; code: string; givenName: string; familyName: string; dateOfBirth: string; nationality: string; };
  Constructors: Array<{ constructorId: string; name: string; nationality: string }>;
}
export interface ConstructorStanding {
  position: string; points: string; wins: string;
  Constructor: { constructorId: string; name: string; nationality: string };
}
export interface Race {
  round: string; raceName: string;
  Circuit: { circuitId: string; circuitName: string; Location: { country: string; locality: string } };
  date: string; time?: string;
  Results?: Array<{ position: string; Driver: { givenName: string; familyName: string; code: string }; Constructor: { name: string }; points: string; status: string; FastestLap?: { rank: string; Time: { time: string } } }>;
}

export async function getDriverStandings(): Promise<DriverStanding[]> {
  try {
    const res = await fetch(`${BASE}/current/driverstandings.json`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
  } catch { return []; }
}
export async function getConstructorStandings(): Promise<ConstructorStanding[]> {
  try {
    const res = await fetch(`${BASE}/current/constructorstandings.json`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
  } catch { return []; }
}
export async function getRaceSchedule(): Promise<Race[]> {
  try {
    const res = await fetch(`${BASE}/current.json`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.MRData.RaceTable.Races ?? [];
  } catch { return []; }
}
export async function getLastRaceResults(): Promise<Race | null> {
  try {
    const res = await fetch(`${BASE}/current/last/results.json`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.MRData.RaceTable.Races[0] ?? null;
  } catch { return null; }
}
export function getNextRace(races: Race[]): Race | null {
  const now = new Date();
  return races.find(r => new Date(`${r.date}T${r.time ?? "12:00:00Z"}`) > now) ?? null;
}
export function getTeamColor(name: string): string {
  const map: Record<string, string> = {
    McLaren:"#FF8000", Ferrari:"#DC0000", Mercedes:"#00D2BE", "Red Bull":"#3671C6",
    Williams:"#64C4FF", "Haas F1 Team":"#B6BABD", "Alpine F1 Team":"#0093CC",
    "Aston Martin":"#358C75", Audi:"#D0D0D0", "RB F1 Team":"#6692FF", "Cadillac Racing":"#FF6900",
  };
  return map[name] ?? "#ffffff";
}
export function getNationality(nat: string): string {
  const map: Record<string, string> = {
    Italian:"🇮🇹", British:"🇬🇧", Monegasque:"🇲🇨", Dutch:"🇳🇱", Australian:"🇦🇺",
    Spanish:"🇪🇸", French:"🇫🇷", Mexican:"🇲🇽", Canadian:"🇨🇦", Finnish:"🇫🇮",
    German:"🇩🇪", Thai:"🇹🇭", Argentine:"🇦🇷", "New Zealander":"🇳🇿", Brazilian:"🇧🇷", American:"🇺🇸",
  };
  return map[nat] ?? "🏁";
}
