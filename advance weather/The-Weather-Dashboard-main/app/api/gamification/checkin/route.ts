import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const today = new Date()
    const todayString = today.toDateString()

    // Get current user stats
    let userStats = await db.collection("UserStats").findOne({ userId })

    if (!userStats) {
      userStats = {
        userId,
        trees: 0,
        streak: 0,
        checkins: 0,
        badges: 0,
        lastCheckin: null,
      }
    }

    // Check if already checked in today
    const lastCheckin = userStats.lastCheckin ? new Date(userStats.lastCheckin).toDateString() : null
    if (lastCheckin === todayString) {
      return NextResponse.json({ error: "Already checked in today" }, { status: 400 })
    }

    // Update stats
    const updatedStats = {
      ...userStats,
      trees: userStats.trees + 1,
      checkins: userStats.checkins + 1,
      lastCheckin: today,
      checkedInToday: true,
    }

    // Update streak
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()

    if (lastCheckin === yesterdayString) {
      updatedStats.streak = userStats.streak + 1
    } else if (lastCheckin !== todayString) {
      updatedStats.streak = 1
    }

    // Check for new badges
    const newBadges = []
    if (updatedStats.trees === 1) newBadges.push({ name: "First Tree", type: "tree" })
    if (updatedStats.streak === 7) newBadges.push({ name: "Week Warrior", type: "streak" })
    if (updatedStats.checkins === 30) newBadges.push({ name: "Monthly Master", type: "checkin" })

    updatedStats.badges = userStats.badges + newBadges.length

    await db.collection("UserStats").updateOne({ userId }, { $set: updatedStats }, { upsert: true })

    return NextResponse.json({
      success: true,
      stats: updatedStats,
      newBadges,
    })
  } catch (error) {
    console.error("Error processing check-in:", error)
    return NextResponse.json({ error: "Failed to process check-in" }, { status: 500 })
  }
}
