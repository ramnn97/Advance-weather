import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock leaderboard data
    const leaderboard = [
      { name: "EcoWarrior123", trees: 45, streak: 12 },
      { name: "WeatherWatcher", trees: 38, streak: 8 },
      { name: "ClimateChampion", trees: 32, streak: 15 },
      { name: "GreenGuardian", trees: 28, streak: 6 },
      { name: "You", trees: 5, streak: 3 },
    ]

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
