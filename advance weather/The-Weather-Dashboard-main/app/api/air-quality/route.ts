import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Mock air quality data - in production, use real AQI API
    const mockAirQuality = {
      aqi: Math.floor(Math.random() * 200) + 20,
      pollutants: [
        { name: "PM2.5", value: `${Math.floor(Math.random() * 50) + 10} μg/m³` },
        { name: "PM10", value: `${Math.floor(Math.random() * 80) + 20} μg/m³` },
        { name: "O3", value: `${Math.floor(Math.random() * 100) + 30} μg/m³` },
        { name: "NO2", value: `${Math.floor(Math.random() * 60) + 15} μg/m³` },
      ],
      healthWarnings: null,
      wildfireRisk: false,
      wildfireAdvice: null,
    }

    // Generate health warnings based on AQI
    if (mockAirQuality.aqi > 150) {
      mockAirQuality.healthWarnings = "Avoid outdoor exercise. Sensitive individuals should stay indoors."
    } else if (mockAirQuality.aqi > 100) {
      mockAirQuality.healthWarnings = "Limit prolonged outdoor activities, especially for sensitive groups."
    }

    // Simulate wildfire detection
    if (Math.random() > 0.8) {
      mockAirQuality.wildfireRisk = true
      mockAirQuality.wildfireAdvice =
        "Wildfire smoke detected in the area. Keep windows closed and use air purifiers if available."
    }

    return NextResponse.json(mockAirQuality)
  } catch (error) {
    console.error("Error fetching air quality data:", error)
    return NextResponse.json({ error: "Failed to fetch air quality data" }, { status: 500 })
  }
}
