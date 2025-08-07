"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react"

export default function Preview() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>
        <button className="p-2 rounded-md bg-secondary">
          <Sun className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for a city..."
            className="flex-1 p-2 rounded-md border"
            defaultValue="New York"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-md">Search</button>
          <button className="p-2 rounded-md border">🎤</button>
        </div>
      </Card>

      {/* Current Weather */}
      <Card className="overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">New York</h2>
                <span className="text-sm text-muted-foreground">United States</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Monday, June 8, 2025</p>

              <div className="flex items-center gap-4">
                <div>
                  <Sun className="h-12 w-12 text-yellow-500" />
                </div>
                <div>
                  <div className="text-4xl font-bold">24°C</div>
                  <div className="text-muted-foreground">Sunny</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Feels Like</p>
                  <p className="font-medium">26°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-medium">65%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-sm text-muted-foreground">Wind</p>
                  <p className="font-medium">12 km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">UV Index</p>
                  <p className="font-medium">5</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Tabs */}
      <Tabs defaultValue="hourly" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
          <TabsTrigger value="daily">7-Day Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="hourly">
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-4 p-2 overflow-x-auto">
                {[
                  { time: "12 PM", icon: <Sun className="h-8 w-8 text-yellow-500" />, temp: "24°C", rain: "0%" },
                  { time: "2 PM", icon: <Sun className="h-8 w-8 text-yellow-500" />, temp: "26°C", rain: "0%" },
                  { time: "4 PM", icon: <Cloud className="h-8 w-8 text-gray-500" />, temp: "25°C", rain: "10%" },
                  { time: "6 PM", icon: <Cloud className="h-8 w-8 text-gray-500" />, temp: "23°C", rain: "20%" },
                  { time: "8 PM", icon: <CloudRain className="h-8 w-8 text-blue-500" />, temp: "21°C", rain: "40%" },
                  { time: "10 PM", icon: <CloudRain className="h-8 w-8 text-blue-500" />, temp: "19°C", rain: "30%" },
                ].map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center w-20 p-2 rounded-md hover:bg-accent"
                  >
                    <span className="text-sm font-medium mb-1">{hour.time}</span>
                    {hour.icon}
                    <span className="text-lg font-bold mt-1">{hour.temp}</span>
                    <span className="text-xs text-muted-foreground">{hour.rain} rain</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="daily">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  {
                    day: "Mon",
                    icon: <Sun className="h-8 w-8 text-yellow-500" />,
                    high: "24°",
                    low: "18°",
                    rain: "0%",
                  },
                  {
                    day: "Tue",
                    icon: <Sun className="h-8 w-8 text-yellow-500" />,
                    high: "26°",
                    low: "19°",
                    rain: "0%",
                  },
                  {
                    day: "Wed",
                    icon: <Cloud className="h-8 w-8 text-gray-500" />,
                    high: "25°",
                    low: "20°",
                    rain: "10%",
                  },
                  {
                    day: "Thu",
                    icon: <CloudRain className="h-8 w-8 text-blue-500" />,
                    high: "22°",
                    low: "17°",
                    rain: "60%",
                  },
                  {
                    day: "Fri",
                    icon: <CloudRain className="h-8 w-8 text-blue-500" />,
                    high: "20°",
                    low: "16°",
                    rain: "70%",
                  },
                  {
                    day: "Sat",
                    icon: <Cloud className="h-8 w-8 text-gray-500" />,
                    high: "22°",
                    low: "17°",
                    rain: "20%",
                  },
                  {
                    day: "Sun",
                    icon: <Sun className="h-8 w-8 text-yellow-500" />,
                    high: "24°",
                    low: "18°",
                    rain: "10%",
                  },
                ].map((day, index) => (
                  <div key={index} className="flex flex-col items-center p-3 rounded-md hover:bg-accent">
                    <span className="font-medium mb-2">{day.day}</span>
                    {day.icon}
                    <div className="mt-2 text-center">
                      <div className="text-lg font-bold">{day.high}</div>
                      <div className="text-sm text-muted-foreground">{day.low}</div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{day.rain} rain</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">AI Weather Insights</h2>
          <Tabs defaultValue="summary">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="outfit">Outfit</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="trend">Weekly Trend</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg">
                    It's a beautiful sunny day in New York with clear skies and a comfortable temperature of 24°C. The
                    low humidity and gentle breeze make for perfect outdoor conditions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
