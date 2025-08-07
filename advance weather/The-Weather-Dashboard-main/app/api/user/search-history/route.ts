import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userPrefs = await db.collection("UserPrefs").findOne({ userId })

    if (!userPrefs) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ recentSearches: userPrefs.recentSearches || [] })
  } catch (error) {
    console.error("Error fetching search history:", error)
    return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, city } = await request.json()

    if (!userId || !city) {
      return NextResponse.json({ error: "User ID and city are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Add to recent searches and keep only the last 10
    const result = await db.collection("UserPrefs").updateOne(
      { userId },
      {
        $push: {
          recentSearches: {
            $each: [{ city, timestamp: new Date() }],
            $slice: -10, // Keep only the last 10 searches
          },
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: "Search history updated successfully",
      result,
    })
  } catch (error) {
    console.error("Error updating search history:", error)
    return NextResponse.json({ error: "Failed to update search history" }, { status: 500 })
  }
}
