"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Umbrella,
  Sun,
  Wind,
  Shirt,
  Brain,
  CalendarClock,
  MapPin,
  AlertTriangle,
  CloudSun,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

interface WeatherInsightsProps {
  weather: any
}

export function WeatherInsights({ weather }: WeatherInsightsProps) {
  const [insights, setInsights] = useState<{
    summary: string | null
    outfit: string | null
    mood: string | null
    trend: string | null
    activities: string | null
    alerts: string | null
  }>({
    summary: null,
    outfit: null,
    mood: null,
    trend: null,
    activities: null,
    alerts: null,
  })

  const [loading, setLoading] = useState<{
    [key: string]: boolean
  }>({
    summary: false,
    outfit: false,
    mood: false,
    trend: false,
    activities: false,
    alerts: false,
  })

  const generateInsight = async (type: string) => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          weather,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate insight")
      const data = await response.json()

      setInsights((prev) => ({
        ...prev,
        [type]: data.result,
      }))
    } catch (error) {
      console.error("Error generating insight:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  // Get outfit image based on temperature
  const getOutfitImage = () => {
    const temp = weather.current.temp_c
    if (temp > 25) {
      return "/placeholder.svg?height=200&width=200&text=Summer+Outfit"
    } else if (temp > 15) {
      return "/placeholder.svg?height=200&width=200&text=Spring+Outfit"
    } else if (temp > 5) {
      return "/placeholder.svg?height=200&width=200&text=Fall+Outfit"
    } else {
      return "/placeholder.svg?height=200&width=200&text=Winter+Outfit"
    }
  }

  // Get mood emoji based on weather condition
  const getMoodEmoji = () => {
    const condition = weather.current.condition.toLowerCase()
    if (condition.includes("sunny") || condition.includes("clear")) {
      return "😊"
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return "😌"
    } else if (condition.includes("cloud")) {
      return "🤔"
    } else if (condition.includes("snow")) {
      return "❄️"
    } else if (condition.includes("thunder") || condition.includes("storm")) {
      return "😰"
    } else {
      return "🙂"
    }
  }

  return (
    <Card className="mt-8 overflow-hidden border-t-4 border-t-primary shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Weather Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-4">
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <CloudSun className="h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="outfit" className="flex items-center gap-1">
              <Shirt className="h-4 w-4" />
              <span className="hidden sm:inline">Outfit</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="trend" className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span className="hidden sm:inline">Trend</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-800/40 rounded-full p-3 flex-shrink-0">
                    <CloudSun className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    {insights.summary ? (
                      <p className="text-lg leading-relaxed">{insights.summary}</p>
                    ) : (
                      <div className="text-center py-8 w-full">
                        <Button onClick={() => generateInsight("summary")} disabled={loading.summary}>
                          {loading.summary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Generate Weather Summary
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outfit" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex justify-center">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 w-[200px] h-[200px] flex items-center justify-center">
                        <Image
                          src={getOutfitImage() || "/placeholder.svg"}
                          alt="Outfit recommendation"
                          width={200}
                          height={200}
                          className="rounded"
                        />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <Shirt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-medium">Today's Outfit Recommendation</h3>
                      </div>
                      {insights.outfit ? (
                        <p className="text-lg leading-relaxed">{insights.outfit}</p>
                      ) : (
                        <div className="text-center py-4">
                          <Button onClick={() => generateInsight("outfit")} disabled={loading.outfit}>
                            {loading.outfit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Outfit Recommendations
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 dark:bg-yellow-800/40 rounded-full p-3 flex-shrink-0">
                      <span className="text-3xl">{getMoodEmoji()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <h3 className="text-lg font-medium">Weather & Your Mood</h3>
                      </div>
                      {insights.mood ? (
                        <p className="text-lg leading-relaxed">{insights.mood}</p>
                      ) : (
                        <div className="text-center py-4">
                          <Button onClick={() => generateInsight("mood")} disabled={loading.mood}>
                            {loading.mood && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Mood & Productivity Insights
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-800/40 rounded-full p-3 flex-shrink-0">
                      <CalendarClock className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Wind className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-medium">Weekly Weather Trend</h3>
                      </div>
                      {insights.trend ? (
                        <p className="text-lg leading-relaxed">{insights.trend}</p>
                      ) : (
                        <div className="text-center py-4">
                          <Button onClick={() => generateInsight("trend")} disabled={loading.trend}>
                            {loading.trend && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analyze Weekly Weather Trend
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 dark:bg-orange-800/40 rounded-full p-3 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Sun className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <h3 className="text-lg font-medium">Recommended Activities</h3>
                      </div>
                      {insights.activities ? (
                        <p className="text-lg leading-relaxed">{insights.activities}</p>
                      ) : (
                        <div className="text-center py-4">
                          <Button onClick={() => generateInsight("activities")} disabled={loading.activities}>
                            {loading.activities && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Activity Recommendations
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 dark:bg-red-800/40 rounded-full p-3 flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Umbrella className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <h3 className="text-lg font-medium">Weather Alerts</h3>
                      </div>
                      {insights.alerts ? (
                        <p className="text-lg leading-relaxed">{insights.alerts}</p>
                      ) : (
                        <div className="text-center py-4">
                          <Button onClick={() => generateInsight("alerts")} disabled={loading.alerts}>
                            {loading.alerts && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Weather Alerts
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
