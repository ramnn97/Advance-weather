"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Map, Radar, CloudRain, Wind, Satellite, Car, MapPin, Loader2, RefreshCw } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface WeatherMapProps {
  location: { lat: number; lon: number; name: string }
}

export function InteractiveWeatherMap({ location }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState("precipitation")
  const [showTraffic, setShowTraffic] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const weatherLayerRef = useRef<any>(null)
  const trafficLayerRef = useRef<any>(null)
  const [layerOpacity, setLayerOpacity] = useState([50])

  const mapLayers = [
    {
      id: "precipitation",
      name: "Precipitation",
      icon: <CloudRain className="h-4 w-4" />,
      color: "bg-blue-500",
      url: "precipitation_new",
    },
    {
      id: "radar",
      name: "Radar",
      icon: <Radar className="h-4 w-4" />,
      color: "bg-cyan-500",
      url: "precipitation",
    },
    {
      id: "wind",
      name: "Wind",
      icon: <Wind className="h-4 w-4" />,
      color: "bg-green-500",
      url: "wind_new",
    },
    {
      id: "clouds",
      name: "Clouds",
      icon: <Satellite className="h-4 w-4" />,
      color: "bg-gray-500",
      url: "clouds_new",
    },
    {
      id: "temperature",
      name: "Temperature",
      icon: <Satellite className="h-4 w-4" />,
      color: "bg-red-500",
      url: "temp_new",
    },
    {
      id: "pressure",
      name: "Pressure",
      icon: <Satellite className="h-4 w-4" />,
      color: "bg-violet-500",
      url: "pressure_new",
    },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && mapContainerRef.current && !mapLoaded) {
      initializeMap()
    }
  }, [location, mapLoaded])

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      updateWeatherLayer()
    }
  }, [activeLayer, mapLoaded])

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      updateTrafficLayer()
    }
  }, [showTraffic, mapLoaded])

  const initializeMap = async () => {
    setIsLoading(true)
    setMapError(false)

    try {
      // Dynamically import Leaflet
      const L = (await import("leaflet")).default

      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        link.crossOrigin = ""
        document.head.appendChild(link)
      }

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      // Remove existing map if any
      if (mapRef.current) {
        mapRef.current.remove()
      }

      // Initialize map
      const map = L.map(mapContainerRef.current!, {
        center: [location.lat, location.lon],
        zoom: 10,
        zoomControl: true,
        attributionControl: true,
      })

      // Add base tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Add location marker
      const customIcon = L.divIcon({
        html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: "custom-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      L.marker([location.lat, location.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat.toFixed(4)}<br>Lon: ${location.lon.toFixed(4)}`)

      mapRef.current = map
      setMapLoaded(true)
      setMapError(false)

      // Add initial weather layer
      updateWeatherLayer()
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const updateWeatherLayer = async () => {
    if (!mapRef.current || !mapLoaded) return

    try {
      const L = (await import("leaflet")).default

      // Remove existing weather layer
      if (weatherLayerRef.current) {
        mapRef.current.removeLayer(weatherLayerRef.current)
      }

      const selectedLayer = mapLayers.find((layer) => layer.id === activeLayer)
      if (!selectedLayer) return

      // Create demo weather overlays instead of using external API tiles
      const bounds = [
        [location.lat - 0.5, location.lon - 0.5],
        [location.lat + 0.5, location.lon + 0.5],
      ] as [[number, number], [number, number]]

      const getLayerColor = () => {
        switch (activeLayer) {
          case "precipitation":
            return "#3b82f6"
          case "radar":
            return "#06b6d4"
          case "wind":
            return "#10b981"
          case "clouds":
            return "#6b7280"
          case "temperature":
            return "#ef4444"
          case "pressure":
            return "#8b5cf6"
          default:
            return "#3b82f6"
        }
      }

      weatherLayerRef.current = L.rectangle(bounds, {
        color: getLayerColor(),
        weight: 2,
        opacity: 0.8,
        fillOpacity: (layerOpacity[0] / 100) * 0.3,
      }).addTo(mapRef.current)

      weatherLayerRef.current.bindPopup(`<b>${selectedLayer.name} Layer</b><br>Demo overlay for ${location.name}`)
    } catch (error) {
      console.error("Error updating weather layer:", error)
    }
  }

  const updateTrafficLayer = async () => {
    if (!mapRef.current || !mapLoaded) return

    try {
      const L = (await import("leaflet")).default

      // Remove existing traffic layer
      if (trafficLayerRef.current) {
        mapRef.current.removeLayer(trafficLayerRef.current)
      }

      if (showTraffic) {
        // For demo purposes, add some traffic indicators
        const trafficPoints = [
          { lat: location.lat + 0.01, lon: location.lon + 0.01, status: "heavy" },
          { lat: location.lat - 0.01, lon: location.lon - 0.01, status: "moderate" },
          { lat: location.lat + 0.02, lon: location.lon - 0.02, status: "light" },
        ]

        const trafficGroup = L.layerGroup()

        trafficPoints.forEach((point) => {
          const color = point.status === "heavy" ? "#ef4444" : point.status === "moderate" ? "#f59e0b" : "#10b981"

          const trafficIcon = L.divIcon({
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>`,
            className: "traffic-marker",
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          })

          L.marker([point.lat, point.lon], { icon: trafficIcon })
            .bindPopup(`<b>Traffic: ${point.status}</b>`)
            .addTo(trafficGroup)
        })

        trafficLayerRef.current = trafficGroup.addTo(mapRef.current)
      }
    } catch (error) {
      console.error("Error updating traffic layer:", error)
    }
  }

  const refreshMap = () => {
    setMapLoaded(false)
    setMapError(false)
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    initializeMap()
  }

  const centerOnLocation = () => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.setView([location.lat, location.lon], 10)
    }
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Interactive Weather Map
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={centerOnLocation} disabled={!mapLoaded}>
              <MapPin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={refreshMap} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layer Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {mapLayers.map((layer) => (
              <Button
                key={layer.id}
                variant={activeLayer === layer.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveLayer(layer.id)}
                className="flex items-center gap-2"
                disabled={!mapLoaded}
              >
                {layer.icon}
                {layer.name}
              </Button>
            ))}
          </div>

          {/* Traffic Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="text-sm font-medium">Traffic Layer</span>
            </div>
            <Switch checked={showTraffic} onCheckedChange={setShowTraffic} disabled={!mapLoaded} />
          </div>
        </div>

        {/* Map Container */}
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "400px" }}>
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                <p className="text-sm font-medium">Loading Map...</p>
                <p className="text-xs text-muted-foreground">{location.name}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {mapError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">Failed to load map</p>
                <Button onClick={refreshMap} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Layer Indicator */}
          {mapLoaded && !isLoading && (
            <div className="absolute top-2 left-2 z-[1000]">
              <Badge className={mapLayers.find((l) => l.id === activeLayer)?.color}>
                {mapLayers.find((l) => l.id === activeLayer)?.name}
              </Badge>
            </div>
          )}

          {/* Traffic Indicator */}
          {showTraffic && mapLoaded && !isLoading && (
            <div className="absolute top-2 right-2 z-[1000]">
              <Badge variant="outline" className="bg-background/80">
                <Car className="h-3 w-3 mr-1" />
                Traffic
              </Badge>
            </div>
          )}

          {/* Location Indicator */}
          {mapLoaded && !isLoading && (
            <div className="absolute bottom-2 left-2 z-[1000]">
              <Badge variant="secondary" className="bg-background/80">
                <MapPin className="h-3 w-3 mr-1" />
                {location.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Map Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <CloudRain className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <div className="text-xs font-medium">Precipitation</div>
            <div className="text-xs text-muted-foreground">Live radar</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <Wind className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <div className="text-xs font-medium">Wind Flow</div>
            <div className="text-xs text-muted-foreground">Current patterns</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <Satellite className="h-5 w-5 mx-auto mb-1 text-gray-500" />
            <div className="text-xs font-medium">Cloud Cover</div>
            <div className="text-xs text-muted-foreground">Satellite view</div>
          </div>
        </div>

        {/* Map Controls Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Click and drag to pan the map</p>
          <p>• Use mouse wheel or zoom controls to zoom in/out</p>
          <p>• Click markers for more information</p>
          <p>• Switch layers to view different weather data</p>
        </div>
      </CardContent>
    </Card>
  )
}
