"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wind, Leaf, AlertTriangle, Shield, Flame } from "lucide-react"
import { useState, useEffect } from "react"

interface AirQualityProps {
  location: { lat: number; lon: number }
}

export function AirQualityDashboard({ location }: AirQualityProps) {
  const [airQuality, setAirQuality] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchAirQuality()
    }
  }, [location])

  const fetchAirQuality = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/air-quality?lat=${location.lat}&lon=${location.lon}`)
      const data = await response.json()
      setAirQuality(data)
    } catch (error) {
      console.error("Error fetching air quality:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500"
    if (aqi <= 100) return "bg-yellow-500"
    if (aqi <= 150) return "bg-orange-500"
    if (aqi <= 200) return "bg-red-500"
    if (aqi <= 300) return "bg-purple-500"
    return "bg-red-800"
  }

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getHealthIcon = (aqi: number) => {
    if (aqi <= 50) return <Shield className="h-5 w-5 text-green-600" />
    if (aqi <= 100) return <Leaf className="h-5 w-5 text-yellow-600" />
    return <AlertTriangle className="h-5 w-5 text-red-600" />
  }

  if (loading) {
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5" />
            Air Quality & Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!airQuality) {
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5" />
            Air Quality & Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Air quality data not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Air Quality & Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AQI Main Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold">{airQuality.aqi}</span>
              <Badge className={`${getAQIColor(airQuality.aqi)} text-white`}>{getAQILabel(airQuality.aqi)}</Badge>
            </div>
            <Progress value={(airQuality.aqi / 300) * 100} className="w-48" />
          </div>
          <div className="text-right">
            {getHealthIcon(airQuality.aqi)}
            <p className="text-sm text-muted-foreground mt-1">Air Quality Index</p>
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {airQuality.pollutants?.map((pollutant: any, index: number) => (
            <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold">{pollutant.value}</div>
              <div className="text-xs text-muted-foreground">{pollutant.name}</div>
            </div>
          ))}
        </div>

        {/* Health Warnings */}
        {airQuality.healthWarnings && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Health Advisory</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">{airQuality.healthWarnings}</p>
              </div>
            </div>
          </div>
        )}

        {/* Wildfire Detection */}
        {airQuality.wildfireRisk && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Flame className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">Wildfire Smoke Detected</h4>
                <p className="text-sm text-red-700 dark:text-red-300">{airQuality.wildfireAdvice}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
