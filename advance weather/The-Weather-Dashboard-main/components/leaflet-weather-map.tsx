"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, Radar, CloudRain, Wind, Satellite, Car, ToggleLeft, ToggleRight, MapPin } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface WeatherMapProps {
  location: { lat: number; lon: number; name: string }
}

export function LeafletWeatherMap({ location }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState("radar")
  const [showTraffic, setShowTraffic] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const mapLayers = [
    { id: "radar", name: "Radar", icon: <Radar className="h-4 w-4" />, color: "bg-blue-500" },
    { id: "precipitation", name: "Rain", icon: <CloudRain className="h-4 w-4" />, color: "bg-cyan-500" },
    { id: "wind", name: "Wind", icon: <Wind className="h-4 w-4" />, color: "bg-green-500" },
    { id: "satellite", name: "Satellite", icon: <Satellite className="h-4 w-4" />, color: "bg-purple-500" },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && mapContainerRef.current && !mapLoaded) {
      initializeMap()
    }
  }, [location, mapLoaded])

  const initializeMap = async () => {
    try {
      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import("leaflet")).default

      // Import Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      if (mapRef.current) {
        mapRef.current.remove()
      }

      // Initialize map
      const map = L.map(mapContainerRef.current!).setView([location.lat, location.lon], 10)

      // Add base tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add location marker
      L.marker([location.lat, location.lon])
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>Current location`)
        .openPopup()

      mapRef.current = map
      setMapLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoaded(false)
    }
  }

  const updateWeatherLayer = async (layerType: string) => {
    if (!mapRef.current || !mapLoaded) return

    try {
      const L = (await import("leaflet")).default

      // Remove existing weather layers
      mapRef.current.eachLayer((layer: any) => {
        if (layer.options && layer.options.isWeatherLayer) {
          mapRef.current.removeLayer(layer)
        }
      })

      // Add new weather layer based on type
      let tileUrl = ""
      const apiKey = "demo" // In production, use real OpenWeatherMap API key

      switch (layerType) {
        case "radar":
          tileUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`
          break
        case "precipitation":
          tileUrl = `https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${apiKey}`
          break
        case "wind":
          tileUrl = `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`
          break
        case "satellite":
          tileUrl = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`
          break
      }

      if (tileUrl) {
        L.tileLayer(tileUrl, {
          attribution: "Weather data © OpenWeatherMap",
          opacity: 0.6,
          isWeatherLayer: true,
        } as any).addTo(mapRef.current)
      }
    } catch (error) {
      console.error("Error updating weather layer:", error)
    }
  }

  useEffect(() => {
    if (mapLoaded) {
      updateWeatherLayer(activeLayer)
    }
  }, [activeLayer, mapLoaded])

  const handleLayerChange = (layerId: string) => {
    setActiveLayer(layerId)
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Interactive Weather Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layer Controls */}
        <div className="flex flex-wrap gap-2">
          {mapLayers.map((layer) => (
            <Button
              key={layer.id}
              variant={activeLayer === layer.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleLayerChange(layer.id)}
              className="flex items-center gap-2"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTraffic(!showTraffic)}
            className="flex items-center gap-2"
          >
            {showTraffic ? (
              <ToggleRight className="h-5 w-5 text-primary" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Map Container */}
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "400px" }}>
          <div ref={mapContainerRef} className="w-full h-full" />

          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto mb-2 text-blue-600 dark:text-blue-300 animate-pulse" />
                <p className="text-sm font-medium">Loading Interactive Map...</p>
                <p className="text-xs text-muted-foreground">{location.name}</p>
              </div>
            </div>
          )}

          {/* Layer Indicator */}
          {mapLoaded && (
            <div className="absolute top-2 left-2 z-[1000]">
              <Badge className={mapLayers.find((l) => l.id === activeLayer)?.color}>
                {mapLayers.find((l) => l.id === activeLayer)?.name}
              </Badge>
            </div>
          )}

          {/* Traffic Indicator */}
          {showTraffic && mapLoaded && (
            <div className="absolute top-2 right-2 z-[1000]">
              <Badge variant="outline" className="bg-background/80">
                <Car className="h-3 w-3 mr-1" />
                Traffic
              </Badge>
            </div>
          )}

          {/* Location Indicator */}
          {mapLoaded && (
            <div className="absolute bottom-2 left-2 z-[1000]">
              <Badge variant="secondary" className="bg-background/80">
                <MapPin className="h-3 w-3 mr-1" />
                {location.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Map Controls Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Click and drag to pan the map</p>
          <p>• Use mouse wheel to zoom in/out</p>
          <p>• Switch layers to view different weather data</p>
          {!mapLoaded && <p className="text-orange-600">• Map loading may take a few seconds...</p>}
        </div>
      </CardContent>
    </Card>
  )
}
