"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, BarChart3, History, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface HistoricalWeatherProps {
  location: string
  currentWeather: any
}

export function HistoricalWeather({ location, currentWeather }: HistoricalWeatherProps) {
  const [historicalData, setHistoricalData] = useState<any>(null)
  const [comparison, setComparison] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location && currentWeather) {
      fetchHistoricalData()
    }
  }, [location, currentWeather])

  const fetchHistoricalData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/historical-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, currentWeather }),
      })
      const data = await response.json()
      setHistoricalData(data.historical)
      setComparison(data.comparison)
    } catch (error) {
      console.error("Error fetching historical data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "warmer" || trend === "higher") return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend === "cooler" || trend === "lower") return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <BarChart3 className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "warmer" || trend === "higher") return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    if (trend === "cooler" || trend === "lower")
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  if (loading) {
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historical Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading historical data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historical Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* This Day Last Year */}
        {historicalData?.lastYear && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-800/40 rounded-full p-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">On This Day Last Year</h4>
                <p className="text-sm text-muted-foreground">
                  {historicalData.lastYear.temperature}°C, {historicalData.lastYear.condition}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon(comparison?.yearOverYear?.trend)}
                  <span className="text-xs">{comparison?.yearOverYear?.description}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Average Comparison */}
        {comparison?.weeklyAverage && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Weekly Average Comparison
            </h4>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">This Week vs Historical Average</span>
                <Badge className={getTrendColor(comparison.weeklyAverage.trend)}>
                  {getTrendIcon(comparison.weeklyAverage.trend)}
                  {comparison.weeklyAverage.difference}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{comparison.weeklyAverage.summary}</p>
            </div>
          </div>
        )}

        {/* Monthly Trends */}
        {comparison?.monthlyTrends && (
          <div className="space-y-3">
            <h4 className="font-medium">Monthly Climate Trends</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {comparison.monthlyTrends.map((trend: any, index: number) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {getTrendIcon(trend.direction)}
                    <span className="font-medium text-sm">{trend.metric}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{trend.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Record Information */}
        {historicalData?.records && (
          <div className="space-y-3">
            <h4 className="font-medium">Weather Records</h4>
            <div className="space-y-2">
              {historicalData.records.map((record: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">{record.type}</span>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{record.value}</span>
                    {record.isRecord && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Record!
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Summary */}
        {comparison?.aiSummary && (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              AI Climate Analysis
            </h4>
            <p className="text-sm text-muted-foreground">{comparison.aiSummary}</p>
          </div>
        )}

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={fetchHistoricalData} disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <History className="h-4 w-4 mr-2" />}
          Refresh Historical Data
        </Button>
      </CardContent>
    </Card>
  )
}
