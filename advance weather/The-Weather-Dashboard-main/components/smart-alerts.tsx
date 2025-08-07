"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Smartphone, AlertTriangle, Sun, CloudRain, Wind, Settings, Check, X } from "lucide-react"
import { useState, useEffect } from "react"

interface SmartAlertsProps {
  userId?: string
  weather: any
}

export function SmartAlerts({ userId = "demo-user", weather }: SmartAlertsProps) {
  const [alertSettings, setAlertSettings] = useState<any>({
    email: false,
    push: false,
    popup: true,
    storm: true,
    uv: true,
    temperature: true,
    airQuality: true,
  })
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAlertSettings()
    generateSmartAlerts()
  }, [userId, weather])

  const fetchAlertSettings = async () => {
    try {
      const response = await fetch(`/api/alerts/settings?userId=${userId}`)
      const data = await response.json()
      if (data.settings) {
        setAlertSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching alert settings:", error)
    }
  }

  const updateAlertSettings = async (newSettings: any) => {
    try {
      const response = await fetch("/api/alerts/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, settings: newSettings }),
      })
      if (response.ok) {
        setAlertSettings(newSettings)
      }
    } catch (error) {
      console.error("Error updating alert settings:", error)
    }
  }

  const generateSmartAlerts = async () => {
    if (!weather) return

    setLoading(true)
    try {
      const response = await fetch("/api/alerts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weather, settings: alertSettings }),
      })
      const data = await response.json()
      setActiveAlerts(data.alerts || [])
    } catch (error) {
      console.error("Error generating alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      await fetch("/api/alerts/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, alertId }),
      })
      setActiveAlerts((alerts) => alerts.filter((alert) => alert.id !== alertId))
    } catch (error) {
      console.error("Error dismissing alert:", error)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "storm":
        return <CloudRain className="h-4 w-4" />
      case "uv":
        return <Sun className="h-4 w-4" />
      case "wind":
        return <Wind className="h-4 w-4" />
      case "temperature":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
      case "medium":
        return "bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300"
      case "low":
        return "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
      default:
        return "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
    }
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Smart Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Notification Preferences
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Methods */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-muted-foreground">Delivery Methods</h5>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email Alerts</span>
                </div>
                <Switch
                  checked={alertSettings.email}
                  onCheckedChange={(checked) => updateAlertSettings({ ...alertSettings, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Switch
                  checked={alertSettings.push}
                  onCheckedChange={(checked) => updateAlertSettings({ ...alertSettings, push: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">In-App Popups</span>
                </div>
                <Switch
                  checked={alertSettings.popup}
                  onCheckedChange={(checked) => updateAlertSettings({ ...alertSettings, popup: checked })}
                />
              </div>
            </div>

            {/* Alert Types */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-muted-foreground">Alert Types</h5>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4" />
                  <span className="text-sm">Storm Warnings</span>
                </div>
                <Switch
                  checked={alertSettings.storm}
                  onCheckedChange={(checked) => updateAlertSettings({ ...alertSettings, storm: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span className="text-sm">UV Index Alerts</span>
                </div>
                <Switch
                  checked={alertSettings.uv}
                  onCheckedChange={(checked) => updateAlertSettings({ ...alertSettings, uv: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Temperature Extremes</span>
                </div>
                <Switch
                  checked={alertSettings.temperature}
                  onCheckedChange={(checked) => updateAlertSettings({ ...alertSettings, temperature: checked })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Active Alerts</h4>
            <div className="space-y-2">
              {activeAlerts.map((alert, index) => (
                <div key={alert.id || index} className={`border rounded-lg p-3 ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{alert.title}</div>
                        <div className="text-sm mt-1">{alert.message}</div>
                        {alert.action && <div className="text-xs mt-2 font-medium">💡 {alert.action}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.severity}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Active Alerts */}
        {activeAlerts.length === 0 && !loading && (
          <div className="text-center py-6 text-muted-foreground">
            <Check className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No active weather alerts</p>
            <p className="text-xs">We'll notify you when conditions change</p>
          </div>
        )}

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={generateSmartAlerts} disabled={loading} className="w-full">
          {loading ? "Generating..." : "Refresh Alerts"}
        </Button>
      </CardContent>
    </Card>
  )
}
