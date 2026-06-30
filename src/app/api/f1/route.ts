import { NextRequest, NextResponse } from "next/server";
const BASE = "https://api.jolpi.ca/ergast/f1";
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "drivers";
  const urlMap: Record<string,string> = {
    drivers:`${BASE}/current/driverstandings.json`,
    constructors:`${BASE}/current/constructorstandings.json`,
    schedule:`${BASE}/current.json`,
    lastrace:`${BASE}/current/last/results.json`,
  };
  const url = urlMap[type];
  if (!url) return NextResponse.json({ error:"unknown type" }, { status:400 });
  try {
    const res = await fetch(url, { next:{ revalidate:300 } });
    const data = await res.json();
    return NextResponse.json(data, { headers:{ "Cache-Control":"s-maxage=300, stale-while-revalidate=60" } });
  } catch { return NextResponse.json({ error:"upstream failed" }, { status:502 }); }
}
