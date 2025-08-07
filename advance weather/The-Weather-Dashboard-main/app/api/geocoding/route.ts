import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("q")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    // Mock geocoding data - in production, use a real geocoding service
    const mockCoordinates = {
      london: { lat: 51.5074, lon: -0.1278 },
      "new york": { lat: 40.7128, lon: -74.006 },
      tokyo: { lat: 35.6762, lon: 139.6503 },
      paris: { lat: 48.8566, lon: 2.3522 },
      sydney: { lat: -33.8688, lon: 151.2093 },
      mumbai: { lat: 19.076, lon: 72.8777 },
      berlin: { lat: 52.52, lon: 13.405 },
    }

    const cityLower = city.toLowerCase()
    const coordinates = mockCoordinates[cityLower] || {
      lat: Math.random() * 180 - 90,
      lon: Math.random() * 360 - 180,
    }

    return NextResponse.json({ coordinates })
  } catch (error) {
    console.error("Error geocoding city:", error)
    return NextResponse.json({ error: "Failed to geocode city" }, { status: 500 })
  }
}
