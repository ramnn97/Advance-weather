import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Clock } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface HourlyForecastProps {
  forecast: any[]
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
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

  const formatTime = (dateTimeStr: string, index: number) => {
    if (!dateTimeStr) {
      const date = new Date()
      date.setHours(date.getHours() + index * 3)
      dateTimeStr = date.toISOString()
    }

    const date = new Date(dateTimeStr)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
  }

  // Ensure we have forecast data
  if (!forecast || forecast.length === 0) {
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hourly Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Hourly forecast data not available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Hourly Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-2">
            {forecast.slice(0, 12).map((hour, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-24 p-3 rounded-lg hover:bg-accent transition-colors bg-card/50"
              >
                <span className="text-sm font-medium mb-2">{formatTime(hour.time, index)}</span>
                <div className="bg-background/80 rounded-full p-2 mb-2">{getWeatherIcon(hour.condition)}</div>
                <span className="text-lg font-bold mt-1">{hour.temp_c || "--"}°C</span>
                <span className="text-xs text-blue-500 font-medium">{hour.chance_of_rain || 0}% rain</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
