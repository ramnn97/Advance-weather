"use client"

import { CardContent } from "@/components/ui/card"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WeatherDisplay } from "./weather-display"
import { HourlyForecast } from "./hourly-forecast"
import { DailyForecast } from "./daily-forecast"
import { WeatherInsights } from "./weather-insights"
import { AirQualityDashboard } from "./air-quality-dashboard"
import { AdvancedWeatherMap } from "./advanced-weather-map"
import { ClimateInsightEngine } from "./climate-insight-engine"
import { EnvironmentalGamification } from "./environmental-gamification"
import { SmartAlerts } from "./smart-alerts"
import { HistoricalWeather } from "./historical-weather"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { VoiceSearch } from "./voice-search"

export function EnhancedWeatherDashboard() {
  const [city, setCity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true)
          try {
            const response = await fetch(
              `/api/weather/coordinates?lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
            )
            if (!response.ok) throw new Error("Failed to fetch weather data")
            const data = await response.json()

            setWeatherData({
              ...data,
              coordinates: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              },
            })
            setCity(data.location.name)
            toast({
              title: "Location Found",
              description: `Weather data loaded for ${data.location.name}`,
            })
          } catch (error) {
            console.error("Error fetching weather:", error)
            toast({
              title: "Error",
              description: "Failed to fetch weather data for your location",
              variant: "destructive",
            })
          } finally {
            setLoading(false)
            setLocationLoading(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocationLoading(false)
          toast({
            title: "Location Access Denied",
            description: "Please search for a city manually or enable location access",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/weather/city?q=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found")
        }
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Get coordinates for the city
      const geoResponse = await fetch(`/api/geocoding?q=${encodeURIComponent(searchQuery)}`)
      const geoData = await geoResponse.json()

      setWeatherData({
        ...data,
        coordinates: geoData.coordinates || { lat: 0, lon: 0 },
      })
      setCity(searchQuery)
      setSearchQuery("")

      toast({
        title: "Weather Updated",
        description: `Weather data loaded for ${data.location.name}`,
      })
    } catch (error: any) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: error.message || "City not found. Please check the spelling and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceResult = (result: string) => {
    setSearchQuery(result)
    if (result) {
      const formEvent = { preventDefault: () => {} } as React.FormEvent
      setTimeout(() => handleSearch(formEvent), 500)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              <path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Advanced Weather Dashboard</h1>
        </div>
        <ThemeToggle />
      </div>

      <Card className="p-4 mb-8 border shadow-md">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a city (e.g., London, New York, Tokyo)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default" disabled={loading} className="bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={locationLoading}>
            <MapPin className="h-4 w-4 mr-2" />
            {locationLoading ? "Finding..." : "My Location"}
          </Button>
          <VoiceSearch onResult={handleVoiceResult} />
        </form>
      </Card>

      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ) : weatherData ? (
        <>
          <WeatherDisplay weather={weatherData} />

          {/* Interactive Weather Map with Air Quality Side Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <AdvancedWeatherMap
                location={{
                  ...weatherData.coordinates,
                  name: weatherData.location.name,
                }}
                weather={weatherData}
              />
            </div>
            <div className="lg:col-span-1">
              <AirQualityDashboard location={weatherData.coordinates} />
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <SmartAlerts weather={weatherData} />
            <EnvironmentalGamification />
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Visibility</span>
                      <span className="font-medium">10 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pressure</span>
                      <span className="font-medium">1013 hPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dew Point</span>
                      <span className="font-medium">15°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cloud Cover</span>
                      <span className="font-medium">{weatherData.current?.cloud || 20}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="forecasts" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="climate">Climate Data</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
            </TabsList>

            <TabsContent value="forecasts" className="space-y-6">
              <HourlyForecast forecast={weatherData.forecast?.hourly || []} />
              <DailyForecast forecast={weatherData.forecast?.daily || []} />
            </TabsContent>

            <TabsContent value="insights">
              <WeatherInsights weather={weatherData} />
            </TabsContent>

            <TabsContent value="climate">
              <ClimateInsightEngine weather={weatherData} location={weatherData.location.name} />
            </TabsContent>

            <TabsContent value="historical">
              <HistoricalWeather location={weatherData.location.name} currentWeather={weatherData.current} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12 bg-gradient-to-b from-primary/5 to-transparent rounded-lg border border-primary/10 shadow-sm">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              <path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">Welcome to Advanced Weather Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Experience AI-powered weather insights, air quality monitoring, and interactive maps
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
            {["London", "New York", "Tokyo", "Paris", "Sydney"].map((city) => (
              <Button
                key={city}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setSearchQuery(city)
                  const formEvent = { preventDefault: () => {} } as React.FormEvent
                  setTimeout(() => handleSearch(formEvent), 100)
                }}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
