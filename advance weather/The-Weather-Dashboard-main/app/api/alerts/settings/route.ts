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
    const settings = await db.collection("AlertSettings").findOne({ userId })

    return NextResponse.json({
      settings: settings?.preferences || {
        email: false,
        push: false,
        popup: true,
        storm: true,
        uv: true,
        temperature: true,
        airQuality: true,
      },
    })
  } catch (error) {
    console.error("Error fetching alert settings:", error)
    return NextResponse.json({ error: "Failed to fetch alert settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, settings } = await request.json()

    if (!userId || !settings) {
      return NextResponse.json({ error: "User ID and settings are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    await db.collection("AlertSettings").updateOne(
      { userId },
      {
        $set: {
          userId,
          preferences: settings,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating alert settings:", error)
    return NextResponse.json({ error: "Failed to update alert settings" }, { status: 500 })
  }
}
