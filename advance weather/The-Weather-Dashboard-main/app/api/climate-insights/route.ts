import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { weather, location } = await request.json()

    if (!weather || !location) {
      return NextResponse.json({ error: "Weather data and location are required" }, { status: 400 })
    }

    const currentTemp = weather.current.temp_c
    const currentDate = new Date()

    // Generate mock historical data for comparison
    const historicalData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString().split("T")[0],
        current: currentTemp + (Math.random() * 6 - 3),
        historical: currentTemp + (Math.random() * 4 - 2),
      }
    }).reverse()

    // Generate AI insights
    const tempDifference = Math.floor(Math.random() * 8) - 4
    const insights = {
      anomaly:
        tempDifference > 2
          ? `Today is ${tempDifference}°C warmer than the historical average for this date.`
          : tempDifference < -2
            ? `Today is ${Math.abs(tempDifference)}°C cooler than the historical average for this date.`
            : null,
      weeklyTrend: `Looking at the week ahead for ${location}, expect varied conditions with temperatures ranging from ${currentTemp - 5}°C to ${currentTemp + 5}°C. The weather pattern shows a gradual ${Math.random() > 0.5 ? "warming" : "cooling"} trend.`,
      trendDirection: Math.random() > 0.5 ? "warming" : "cooling",
      climateShifts: [
        {
          type: "warming",
          metric: "Average Temperature",
          description: `+${(Math.random() * 2).toFixed(1)}°C vs last month`,
        },
        {
          type: "stable",
          metric: "Precipitation",
          description: `${(Math.random() * 20 + 80).toFixed(0)}% of normal levels`,
        },
      ],
    }

    return NextResponse.json({
      insights,
      historicalData,
    })
  } catch (error) {
    console.error("Error generating climate insights:", error)
    return NextResponse.json({ error: "Failed to generate climate insights" }, { status: 500 })
  }
}
