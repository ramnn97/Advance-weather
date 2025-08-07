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
      return NextResponse.json({ error: "User preferences not found" }, { status: 404 })
    }

    return NextResponse.json(userPrefs)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, preferredUnit, darkMode } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("UserPrefs").updateOne(
      { userId },
      {
        $set: {
          preferredUnit,
          darkMode,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: "User preferences updated successfully",
      result,
    })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ error: "Failed to update user preferences" }, { status: 500 })
  }
}
