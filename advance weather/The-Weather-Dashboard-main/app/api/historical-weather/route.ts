import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { location, currentWeather } = await request.json()

    if (!location || !currentWeather) {
      return NextResponse.json({ error: "Location and current weather are required" }, { status: 400 })
    }

    const currentTemp = currentWeather.temp_c
    const currentDate = new Date()

    // Generate mock historical data
    const lastYear = new Date(currentDate)
    lastYear.setFullYear(lastYear.getFullYear() - 1)

    const historical = {
      lastYear: {
        temperature: currentTemp + (Math.random() * 6 - 3),
        condition: ["Sunny", "Cloudy", "Rainy", "Clear"][Math.floor(Math.random() * 4)],
        date: lastYear.toDateString(),
      },
      records: [
        {
          type: "Highest Temperature",
          value: `${currentTemp + Math.floor(Math.random() * 10 + 5)}°C`,
          date: "July 15, 2019",
          isRecord: currentTemp > 35,
        },
        {
          type: "Lowest Temperature",
          value: `${currentTemp - Math.floor(Math.random() * 15 + 10)}°C`,
          date: "January 8, 2021",
          isRecord: currentTemp < 0,
        },
      ],
    }

    const comparison = {
      yearOverYear: {
        trend: currentTemp > historical.lastYear.temperature ? "warmer" : "cooler",
        description: `${Math.abs(currentTemp - historical.lastYear.temperature).toFixed(1)}°C ${currentTemp > historical.lastYear.temperature ? "warmer" : "cooler"} than last year`,
      },
      weeklyAverage: {
        trend: Math.random() > 0.5 ? "warmer" : "cooler",
        difference: `${(Math.random() * 4 + 1).toFixed(1)}°C`,
        summary: `This week is ${(Math.random() * 3 + 1).toFixed(1)}°C ${Math.random() > 0.5 ? "above" : "below"} the historical average for this time of year.`,
      },
      monthlyTrends: [
        {
          metric: "Temperature",
          direction: "warmer",
          description: `+${(Math.random() * 2 + 0.5).toFixed(1)}°C above monthly average`,
        },
        {
          metric: "Precipitation",
          direction: "lower",
          description: `${Math.floor(Math.random() * 30 + 60)}% of normal rainfall`,
        },
      ],
      aiSummary: `Based on historical patterns, ${location} is experiencing ${Math.random() > 0.5 ? "warmer than usual" : "typical"} conditions for this time of year. Climate trends suggest a gradual ${Math.random() > 0.5 ? "warming" : "cooling"} pattern over the past decade.`,
    }

    return NextResponse.json({
      historical,
      comparison,
    })
  } catch (error) {
    console.error("Error fetching historical weather:", error)
    return NextResponse.json({ error: "Failed to fetch historical weather data" }, { status: 500 })
  }
}
