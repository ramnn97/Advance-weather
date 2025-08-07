"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WeatherDisplay } from "./weather-display"
import { HourlyForecast } from "./hourly-forecast"
import { DailyForecast } from "./daily-forecast"
import { WeatherInsights } from "./weather-insights"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { VoiceSearch } from "./voice-search"

export function WeatherDashboard() {
  const [city, setCity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Try to get user's location on initial load
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

            // Debug logging
            console.log("Weather data received:", data)
            console.log("Daily forecast:", data.forecast?.daily)

            setWeatherData(data)
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
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      })
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

      // Debug logging
      console.log("Search weather data received:", data)
      console.log("Daily forecast:", data.forecast?.daily)

      setWeatherData(data)
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
    // Auto-submit after voice recognition
    if (result) {
      const formEvent = { preventDefault: () => {} } as React.FormEvent
      setTimeout(() => handleSearch(formEvent), 500)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <h1 className="text-3xl font-bold">Weather Dashboard</h1>
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

          <Tabs defaultValue="hourly" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
              <TabsTrigger value="daily">7-Day Forecast</TabsTrigger>
            </TabsList>
            <TabsContent value="hourly">
              <HourlyForecast forecast={weatherData.forecast?.hourly || []} />
            </TabsContent>
            <TabsContent value="daily">
              <DailyForecast forecast={weatherData.forecast?.daily || []} />
            </TabsContent>
          </Tabs>

          <WeatherInsights weather={weatherData} />
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
          <h2 className="text-xl font-medium mb-2">Welcome to Weather Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Search for any city worldwide or use your current location to get started
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
