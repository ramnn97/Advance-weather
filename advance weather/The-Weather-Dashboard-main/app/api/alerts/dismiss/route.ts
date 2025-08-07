import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, alertId } = await request.json()

    if (!userId || !alertId) {
      return NextResponse.json({ error: "User ID and alert ID are required" }, { status: 400 })
    }

    // In a real app, you would store dismissed alerts in the database
    // For now, we'll just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error dismissing alert:", error)
    return NextResponse.json({ error: "Failed to dismiss alert" }, { status: 500 })
  }
}
