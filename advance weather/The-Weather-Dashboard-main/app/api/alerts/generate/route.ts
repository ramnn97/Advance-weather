import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { weather, settings } = await request.json()

    if (!weather) {
      return NextResponse.json({ error: "Weather data is required" }, { status: 400 })
    }

    const alerts = []
    const current = weather.current

    // Generate alerts based on weather conditions and user settings
    if (settings?.storm && current.wind_kph > 25) {
      alerts.push({
        id: `storm-${Date.now()}`,
        type: "storm",
        severity: "medium",
        title: "Strong Wind Advisory",
        message: "Strong winds detected. Secure loose objects and avoid outdoor activities.",
        action: "Charge your devices in case of power outages.",
      })
    }

    if (settings?.uv && current.uv > 7) {
      alerts.push({
        id: `uv-${Date.now()}`,
        type: "uv",
        severity: "high",
        title: "High UV Index Warning",
        message: `UV Index is ${current.uv}. Skin damage can occur quickly.`,
        action: "Wear sunscreen SPF 30+, sunglasses, and protective clothing.",
      })
    }

    if (settings?.temperature && current.temp_c > 35) {
      alerts.push({
        id: `heat-${Date.now()}`,
        type: "temperature",
        severity: "high",
        title: "Extreme Heat Warning",
        message: `Temperature is ${current.temp_c}°C. Heat exhaustion risk is high.`,
        action: "Stay hydrated, seek shade, and limit outdoor activities.",
      })
    }

    if (settings?.temperature && current.temp_c < 0) {
      alerts.push({
        id: `cold-${Date.now()}`,
        type: "temperature",
        severity: "medium",
        title: "Freezing Temperature Alert",
        message: `Temperature is ${current.temp_c}°C. Frostbite risk exists.`,
        action: "Dress warmly in layers and limit time outdoors.",
      })
    }

    // Rain alert
    if (current.condition.toLowerCase().includes("rain")) {
      alerts.push({
        id: `rain-${Date.now()}`,
        type: "storm",
        severity: "low",
        title: "Rain Expected",
        message: "Rain is currently falling in your area.",
        action: "Carry an umbrella and drive carefully.",
      })
    }

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error generating alerts:", error)
    return NextResponse.json({ error: "Failed to generate alerts" }, { status: 500 })
  }
}
