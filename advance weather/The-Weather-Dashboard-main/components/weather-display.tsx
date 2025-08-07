import { Card, CardContent } from "@/components/ui/card"
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  CloudSun,
} from "lucide-react"

interface WeatherDisplayProps {
  weather: any
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const { current, location } = weather

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("clear") || conditionLower.includes("sunny"))
      return <Sun className="h-16 w-16 text-yellow-500" />
    if (conditionLower.includes("rain")) return <CloudRain className="h-16 w-16 text-blue-500" />
    if (conditionLower.includes("cloud")) return <Cloud className="h-16 w-16 text-gray-500" />
    if (conditionLower.includes("snow")) return <CloudSnow className="h-16 w-16 text-blue-200" />
    if (conditionLower.includes("fog") || conditionLower.includes("mist"))
      return <CloudFog className="h-16 w-16 text-gray-400" />
    if (conditionLower.includes("thunder") || conditionLower.includes("lightning"))
      return <CloudLightning className="h-16 w-16 text-purple-500" />
    if (conditionLower.includes("drizzle")) return <CloudDrizzle className="h-16 w-16 text-blue-400" />
    if (conditionLower.includes("partly") && (conditionLower.includes("sunny") || conditionLower.includes("clear")))
      return <CloudSun className="h-16 w-16 text-yellow-500" />
    return <Sun className="h-16 w-16 text-yellow-500" />
  }

  return (
    <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{location.name}</h2>
                <span className="text-sm text-muted-foreground">
                  {location.region && `${location.region}, `}
                  {location.country}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex items-center gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-full p-4 shadow-md">
                  {getWeatherIcon(current.condition)}
                </div>
                <div>
                  <div className="text-5xl font-bold">{current.temp_c}°C</div>
                  <div className="text-muted-foreground capitalize">{current.condition}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
                  <Thermometer className="h-5 w-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feels Like</p>
                  <p className="font-medium">{current.feelslike_c}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                  <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-medium">{current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-full p-2">
                  <Wind className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wind</p>
                  <p className="font-medium">{current.wind_kph} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2">
                  <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">UV Index</p>
                  <p className="font-medium">{current.uv}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
