import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()

    // Mock achievements for demo
    const achievements = [
      {
        name: "Weather Watcher",
        description: "Checked weather for 7 consecutive days",
        type: "streak",
        points: 100,
        date: new Date().toISOString(),
      },
      {
        name: "Eco Warrior",
        description: "Planted your first digital tree",
        type: "tree",
        points: 50,
        date: new Date().toISOString(),
      },
      {
        name: "Air Quality Monitor",
        description: "Checked air quality 10 times",
        type: "air",
        points: 75,
        date: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}
