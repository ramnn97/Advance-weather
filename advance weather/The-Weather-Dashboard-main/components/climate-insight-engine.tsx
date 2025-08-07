"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, Calendar, Thermometer, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ClimateInsightProps {
  weather: any
  location: string
}

export function ClimateInsightEngine({ weather, location }: ClimateInsightProps) {
  const [insights, setInsights] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (weather && location) {
      fetchClimateInsights()
    }
  }, [weather, location])

  const fetchClimateInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/climate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weather, location }),
      })
      const data = await response.json()
      setInsights(data.insights)
      setHistoricalData(data.historicalData || [])
    } catch (error) {
      console.error("Error fetching climate insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "warming") return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend === "cooling") return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <BarChart3 className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "warming") return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    if (trend === "cooling") return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  if (loading) {
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Climate Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Analyzing climate patterns...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Climate Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Anomaly */}
        {insights?.anomaly && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 dark:bg-orange-800/40 rounded-full p-2">
                <Thermometer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Temperature Anomaly Detected</h4>
                <p className="text-sm text-muted-foreground">{insights.anomaly}</p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Trend */}
        {insights?.weeklyTrend && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h4 className="font-medium">Weekly Trend Analysis</h4>
              <Badge className={getTrendColor(insights.trendDirection)}>
                {getTrendIcon(insights.trendDirection)}
                {insights.trendDirection}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{insights.weeklyTrend}</p>
          </div>
        )}

        {/* Historical Comparison Chart */}
        {historicalData.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Temperature Trend (Last 7 Days)
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} name="Current Year" />
                  <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Historical Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Climate Shift Indicators */}
        {insights?.climateShifts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.climateShifts.map((shift: any, index: number) => (
              <div key={index} className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  {getTrendIcon(shift.type)}
                  <span className="font-medium text-sm">{shift.metric}</span>
                </div>
                <p className="text-xs text-muted-foreground">{shift.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={fetchClimateInsights} disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BarChart3 className="h-4 w-4 mr-2" />}
          Refresh Climate Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
