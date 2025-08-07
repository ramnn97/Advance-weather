import { NextResponse } from "next/server"

export const maxDuration = 30 // 30 seconds

// Mock AI responses for demo purposes
function generateMockInsight(type: string, weather: any): string {
  const { current, location } = weather

  switch (type) {
    case "summary":
      return `Today in ${location.name}, you can expect ${current.condition.toLowerCase()} skies with a comfortable temperature of ${current.temp_c}°C. The humidity is at ${current.humidity}% with gentle winds at ${current.wind_kph} km/h, making it a pleasant day overall.`

    case "outfit":
      if (current.temp_c > 25) {
        return (
          "Perfect weather for light, breathable clothing! Consider wearing a t-shirt, shorts, and comfortable sandals. Don't forget sunglasses and sunscreen with the UV index at " +
          current.uv +
          "."
        )
      } else if (current.temp_c > 15) {
        return "Great weather for casual wear! A light sweater or long-sleeve shirt with jeans would be ideal. You might want to carry a light jacket just in case."
      } else {
        return "It's a bit chilly today, so layer up! Consider wearing a warm jacket, long pants, and closed-toe shoes. A scarf might also come in handy."
      }

    case "mood":
      if (current.condition.toLowerCase().includes("sunny") || current.condition.toLowerCase().includes("clear")) {
        return "The sunny weather is perfect for boosting your mood and productivity! Natural sunlight can increase serotonin levels, making this an excellent day for outdoor activities and getting things done."
      } else if (current.condition.toLowerCase().includes("rain")) {
        return "Rainy weather can be perfect for cozy indoor activities and focused work. Consider this a great day for reading, creative projects, or catching up on indoor tasks while enjoying the soothing sound of rain."
      } else {
        return "The current weather conditions create a balanced atmosphere for both relaxation and productivity. It's a good day to find your rhythm and tackle tasks at your own pace."
      }

    case "trend":
      return `Looking at the week ahead for ${location.name}, expect varied conditions with temperatures ranging from the low teens to mid-twenties. The weather pattern shows a mix of sunny and cloudy days, with occasional chances of precipitation. Overall, it's shaping up to be a typical week with pleasant conditions for most outdoor activities.`

    case "activities":
      const activities = []
      if (current.temp_c > 20 && !current.condition.toLowerCase().includes("rain")) {
        activities.push("outdoor hiking", "picnics in the park", "cycling", "outdoor sports")
      }
      if (current.condition.toLowerCase().includes("rain") || current.temp_c < 15) {
        activities.push("visiting museums", "indoor rock climbing", "shopping", "movie theaters", "cozy cafes")
      }
      activities.push("reading", "cooking", "yoga")

      return `Based on today's weather, here are some great activity suggestions: ${activities.slice(0, 4).join(", ")}. The current conditions of ${current.condition.toLowerCase()} at ${current.temp_c}°C make it ideal for both indoor and outdoor pursuits.`

    case "alerts":
      const alerts = []
      if (current.uv > 7) {
        alerts.push("High UV index detected - wear sunscreen and protective clothing")
      }
      if (current.wind_kph > 25) {
        alerts.push("Strong winds expected - secure loose objects")
      }
      if (current.temp_c > 30) {
        alerts.push("High temperature warning - stay hydrated and avoid prolonged sun exposure")
      }
      if (current.temp_c < 5) {
        alerts.push("Cold weather advisory - dress warmly and be cautious of icy conditions")
      }

      if (alerts.length === 0) {
        return "No weather alerts for your area. Current conditions are within normal ranges. Enjoy your day and stay weather-aware!"
      }

      return "Weather advisories: " + alerts.join(". ") + ". Please take appropriate precautions."

    default:
      return "Weather insight not available at this time."
  }
}

export async function POST(request: Request) {
  try {
    const { type, weather } = await request.json()

    if (!type || !weather) {
      return NextResponse.json({ error: "Type and weather data are required" }, { status: 400 })
    }

    // For demo purposes, we'll use mock AI responses
    // In production, you would replace this with actual OpenAI API calls
    const result = generateMockInsight(type, weather)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error generating insight:", error)
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 })
  }
}
