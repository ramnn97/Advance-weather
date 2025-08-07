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

    // Get or create user stats
    let userStats = await db.collection("UserStats").findOne({ userId })

    if (!userStats) {
      userStats = {
        userId,
        trees: 0,
        streak: 0,
        checkins: 0,
        badges: 0,
        checkedInToday: false,
        lastCheckin: null,
        nextBadge: {
          name: "First Tree",
          progress: 0,
          target: 1,
        },
      }
      await db.collection("UserStats").insertOne(userStats)
    }

    // Check if user checked in today
    const today = new Date().toDateString()
    const lastCheckin = userStats.lastCheckin ? new Date(userStats.lastCheckin).toDateString() : null
    userStats.checkedInToday = lastCheckin === today

    return NextResponse.json(userStats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
