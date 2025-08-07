import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, CalendarDays } from "lucide-react"

interface DailyForecastProps {
  forecast: any[]
}

export function DailyForecast({ forecast }: DailyForecastProps) {
  // Debug logging
  console.log("DailyForecast received forecast:", forecast)

  const getWeatherIcon = (condition: string) => {
    if (!condition) return <Sun className="h-8 w-8 text-yellow-500" />

    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("clear") || conditionLower.includes("sunny"))
      return <Sun className="h-8 w-8 text-yellow-500" />
    if (conditionLower.includes("rain") || conditionLower.includes("shower"))
      return <CloudRain className="h-8 w-8 text-blue-500" />
    if (conditionLower.includes("cloud") || conditionLower.includes("overcast"))
      return <Cloud className="h-8 w-8 text-gray-500" />
    if (conditionLower.includes("snow") || conditionLower.includes("blizzard"))
      return <CloudSnow className="h-8 w-8 text-blue-200" />
    if (conditionLower.includes("fog") || conditionLower.includes("mist"))
      return <CloudFog className="h-8 w-8 text-gray-400" />
    if (conditionLower.includes("thunder") || conditionLower.includes("lightning"))
      return <CloudLightning className="h-8 w-8 text-purple-500" />
    if (conditionLower.includes("drizzle")) return <CloudDrizzle className="h-8 w-8 text-blue-400" />
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  const formatDay = (dateStr: string, index: number) => {
    if (!dateStr) {
      const date = new Date()
      date.setDate(date.getDate() + index)
      dateStr = date.toISOString().split("T")[0]
    }

    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }
  }

  const formatCondition = (condition: string) => {
    if (!condition) return "Clear"
    return condition.length > 15 ? condition.substring(0, 15) + "..." : condition
  }

  // Check if we have valid forecast data
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    console.log("No forecast data available")
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            7-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">7-day forecast data not available</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may be due to API limitations. Try searching for a different city.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {forecast.slice(0, 7).map((day, index) => {
            console.log(`Day ${index}:`, day)
            return (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors bg-card/50"
              >
                <span className="font-medium mb-2 text-sm">{formatDay(day.date, index)}</span>
                <div className="bg-background/80 rounded-full p-2 mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="text-center mb-2">
                  <div className="text-lg font-bold">{day.maxtemp_c || day.avgtemp_c || day.temp_c || "--"}°</div>
                  <div className="text-sm text-muted-foreground">{day.mintemp_c || day.temp_c || "--"}°</div>
                </div>
                <div className="text-xs text-center">
                  <div className="text-muted-foreground mb-1">{formatCondition(day.condition || "Clear")}</div>
                  <div className="text-blue-500 font-medium">{day.chance_of_rain || 0}% rain</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
