"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Map,
  Radar,
  CloudRain,
  Wind,
  Satellite,
  Car,
  MapPin,
  Loader2,
  RefreshCw,
  Thermometer,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface AdvancedWeatherMapProps {
  location: { lat: number; lon: number; name: string }
  weather?: any
}

export function AdvancedWeatherMap({ location, weather }: AdvancedWeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState("precipitation")
  const [showTraffic, setShowTraffic] = useState(false)
  const [showWeatherStations, setShowWeatherStations] = useState(true)
  const [layerOpacity, setLayerOpacity] = useState([60])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapStyle, setMapStyle] = useState("street")
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const weatherLayerRef = useRef<any>(null)
  const trafficLayerRef = useRef<any>(null)
  const stationsLayerRef = useRef<any>(null)

  const mapLayers = [
    {
      id: "precipitation",
      name: "Precipitation",
      icon: <CloudRain className="h-4 w-4" />,
      color: "bg-blue-500",
      description: "Rain and snow intensity",
    },
    {
      id: "radar",
      name: "Radar",
      icon: <Radar className="h-4 w-4" />,
      color: "bg-cyan-500",
      description: "Weather radar data",
    },
    {
      id: "wind",
      name: "Wind",
      icon: <Wind className="h-4 w-4" />,
      color: "bg-green-500",
      description: "Wind speed and direction",
    },
    {
      id: "clouds",
      name: "Clouds",
      icon: <Satellite className="h-4 w-4" />,
      color: "bg-gray-500",
      description: "Cloud coverage",
    },
    {
      id: "temperature",
      name: "Temperature",
      icon: <Thermometer className="h-4 w-4" />,
      color: "bg-red-500",
      description: "Temperature distribution",
    },
    {
      id: "pressure",
      name: "Pressure",
      icon: <Eye className="h-4 w-4" />,
      color: "bg-purple-500",
      description: "Atmospheric pressure",
    },
  ]

  const mapStyles = [
    { id: "street", name: "Street", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
    {
      id: "satellite",
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },
    { id: "terrain", name: "Terrain", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" },
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
  }, [activeLayer, layerOpacity, mapLoaded])

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      updateTrafficLayer()
    }
  }, [showTraffic, mapLoaded])

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      updateWeatherStations()
    }
  }, [showWeatherStations, mapLoaded])

  const initializeMap = async () => {
    setIsLoading(true)
    setMapError(false)

    try {
      const L = (await import("leaflet")).default

      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

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

      // Initialize map with custom controls
      const map = L.map(mapContainerRef.current!, {
        center: [location.lat, location.lon],
        zoom: 10,
        zoomControl: false, // We'll add custom zoom controls
        attributionControl: true,
      })

      // Add custom zoom controls
      const zoomControl = L.control.zoom({
        position: "topright",
      })
      zoomControl.addTo(map)

      // Add base tile layer
      const currentStyle = mapStyles.find((style) => style.id === mapStyle) || mapStyles[0]
      L.tileLayer(currentStyle.url, {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map)

      // Add main location marker with custom popup
      const mainMarkerIcon = L.divIcon({
        html: `
          <div style="
            background: linear-gradient(45deg, #3b82f6, #1d4ed8);
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="color: white; font-size: 12px; font-weight: bold;">📍</div>
          </div>
        `,
        className: "main-location-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
          <div style="font-size: 12px; color: #666;">
            <div>Latitude: ${location.lat.toFixed(4)}°</div>
            <div>Longitude: ${location.lon.toFixed(4)}°</div>
            ${
              weather
                ? `
              <hr style="margin: 8px 0;">
              <div><strong>Temperature:</strong> ${weather.current?.temp_c}°C</div>
              <div><strong>Condition:</strong> ${weather.current?.condition}</div>
              <div><strong>Humidity:</strong> ${weather.current?.humidity}%</div>
              <div><strong>Wind:</strong> ${weather.current?.wind_kph} km/h</div>
            `
                : ""
            }
          </div>
        </div>
      `

      L.marker([location.lat, location.lon], { icon: mainMarkerIcon }).addTo(map).bindPopup(popupContent)

      mapRef.current = map
      setMapLoaded(true)
      setMapError(false)

      // Add initial layers
      updateWeatherLayer()
      updateWeatherStations()
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

      if (weatherLayerRef.current) {
        mapRef.current.removeLayer(weatherLayerRef.current)
      }

      const selectedLayer = mapLayers.find((layer) => layer.id === activeLayer)
      if (!selectedLayer) return

      // Create demo weather overlay instead of using external API
      const bounds = [
        [location.lat - 0.3, location.lon - 0.3],
        [location.lat + 0.3, location.lon + 0.3],
      ] as [[number, number], [number, number]]

      const getLayerStyle = () => {
        const opacity = layerOpacity[0] / 100
        switch (activeLayer) {
          case "precipitation":
            return { color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: opacity * 0.4, weight: 2, opacity: opacity }
          case "radar":
            return { color: "#06b6d4", fillColor: "#06b6d4", fillOpacity: opacity * 0.3, weight: 2, opacity: opacity }
          case "wind":
            return { color: "#10b981", fillColor: "#10b981", fillOpacity: opacity * 0.2, weight: 2, opacity: opacity }
          case "clouds":
            return { color: "#6b7280", fillColor: "#6b7280", fillOpacity: opacity * 0.5, weight: 2, opacity: opacity }
          case "temperature":
            return { color: "#ef4444", fillColor: "#ef4444", fillOpacity: opacity * 0.3, weight: 2, opacity: opacity }
          case "pressure":
            return { color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: opacity * 0.3, weight: 2, opacity: opacity }
          default:
            return { color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: opacity * 0.3, weight: 2, opacity: opacity }
        }
      }

      // Create multiple overlays for more realistic weather data
      const overlays = []
      for (let i = 0; i < 3; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.4
        const offsetLon = (Math.random() - 0.5) * 0.4
        const size = 0.1 + Math.random() * 0.2

        const overlayBounds = [
          [location.lat + offsetLat - size, location.lon + offsetLon - size],
          [location.lat + offsetLat + size, location.lon + offsetLon + size],
        ] as [[number, number], [number, number]]

        const overlay = L.rectangle(overlayBounds, getLayerStyle())
        overlays.push(overlay)
      }

      weatherLayerRef.current = L.layerGroup(overlays).addTo(mapRef.current)

      weatherLayerRef.current.bindPopup(`
      <div>
        <h4>${selectedLayer.name} Layer</h4>
        <p>${selectedLayer.description}</p>
        <small>Demo data for ${location.name}</small>
      </div>
    `)
    } catch (error) {
      console.error("Error updating weather layer:", error)
    }
  }

  const updateTrafficLayer = async () => {
    if (!mapRef.current || !mapLoaded) return

    try {
      const L = (await import("leaflet")).default

      if (trafficLayerRef.current) {
        mapRef.current.removeLayer(trafficLayerRef.current)
      }

      if (showTraffic) {
        const trafficData = [
          { lat: location.lat + 0.02, lon: location.lon + 0.02, status: "heavy", road: "Main St" },
          { lat: location.lat - 0.01, lon: location.lon - 0.01, status: "moderate", road: "Oak Ave" },
          { lat: location.lat + 0.03, lon: location.lon - 0.02, status: "light", road: "Pine Rd" },
          { lat: location.lat - 0.02, lon: location.lon + 0.03, status: "heavy", road: "Elm St" },
        ]

        const trafficMarkers = trafficData.map((point) => {
          const color = point.status === "heavy" ? "#ef4444" : point.status === "moderate" ? "#f59e0b" : "#10b981"

          const trafficIcon = L.divIcon({
            html: `
              <div style="
                background-color: ${color}; 
                width: 16px; 
                height: 16px; 
                border-radius: 50%; 
                border: 2px solid white; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              "></div>
              <style>
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.2); opacity: 0.7; }
                  100% { transform: scale(1); opacity: 1; }
                }
              </style>
            `,
            className: "traffic-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          return L.marker([point.lat, point.lon], { icon: trafficIcon }).bindPopup(`
              <div>
                <h4>🚗 Traffic Status</h4>
                <p><strong>Road:</strong> ${point.road}</p>
                <p><strong>Status:</strong> ${point.status.charAt(0).toUpperCase() + point.status.slice(1)}</p>
                <p><strong>Impact:</strong> ${
                  point.status === "heavy"
                    ? "Severe delays expected"
                    : point.status === "moderate"
                      ? "Minor delays possible"
                      : "Normal flow"
                }</p>
              </div>
            `)
        })

        trafficLayerRef.current = L.layerGroup(trafficMarkers).addTo(mapRef.current)
      }
    } catch (error) {
      console.error("Error updating traffic layer:", error)
    }
  }

  const updateWeatherStations = async () => {
    if (!mapRef.current || !mapLoaded) return

    try {
      const L = (await import("leaflet")).default

      if (stationsLayerRef.current) {
        mapRef.current.removeLayer(stationsLayerRef.current)
      }

      if (showWeatherStations) {
        const stations = [
          { lat: location.lat + 0.05, lon: location.lon + 0.05, temp: 22, humidity: 65, name: "Station A" },
          { lat: location.lat - 0.03, lon: location.lon + 0.04, temp: 24, humidity: 58, name: "Station B" },
          { lat: location.lat + 0.02, lon: location.lon - 0.06, temp: 21, humidity: 72, name: "Station C" },
        ]

        const stationMarkers = stations.map((station) => {
          const stationIcon = L.divIcon({
            html: `
              <div style="
                background: linear-gradient(45deg, #f59e0b, #d97706);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
              ">
                🌡️
              </div>
            `,
            className: "weather-station-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })

          return L.marker([station.lat, station.lon], { icon: stationIcon }).bindPopup(`
              <div>
                <h4>🌡️ ${station.name}</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                  <div>
                    <strong>Temperature</strong><br>
                    ${station.temp}°C
                  </div>
                  <div>
                    <strong>Humidity</strong><br>
                    ${station.humidity}%
                  </div>
                </div>
                <small style="color: #666; margin-top: 8px; display: block;">
                  Last updated: ${new Date().toLocaleTimeString()}
                </small>
              </div>
            `)
        })

        stationsLayerRef.current = L.layerGroup(stationMarkers).addTo(mapRef.current)
      }
    } catch (error) {
      console.error("Error updating weather stations:", error)
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

  const zoomIn = () => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.zoomIn()
    }
  }

  const zoomOut = () => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.zoomOut()
    }
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Advanced Weather Map
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={!mapLoaded}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={!mapLoaded}>
              <ZoomOut className="h-4 w-4" />
            </Button>
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
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {mapLayers.map((layer) => (
              <Button
                key={layer.id}
                variant={activeLayer === layer.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveLayer(layer.id)}
                className="flex items-center gap-2"
                disabled={!mapLoaded}
                title={layer.description}
              >
                {layer.icon}
                {layer.name}
              </Button>
            ))}
          </div>

          {/* Layer Opacity Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Layer Opacity</label>
              <span className="text-sm text-muted-foreground">{layerOpacity[0]}%</span>
            </div>
            <Slider
              value={layerOpacity}
              onValueChange={setLayerOpacity}
              max={100}
              min={10}
              step={10}
              disabled={!mapLoaded}
              className="w-full"
            />
          </div>

          {/* Additional Layers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="text-sm font-medium">Traffic</span>
              </div>
              <Switch checked={showTraffic} onCheckedChange={setShowTraffic} disabled={!mapLoaded} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span className="text-sm font-medium">Stations</span>
              </div>
              <Switch checked={showWeatherStations} onCheckedChange={setShowWeatherStations} disabled={!mapLoaded} />
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "400px" }}>
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-[1000]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                <p className="text-sm font-medium">Initializing Map...</p>
                <p className="text-xs text-muted-foreground">{location.name}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {mapError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-[1000]">
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

          {/* Active Layer Indicator */}
          {mapLoaded && !isLoading && (
            <div className="absolute top-3 left-3 z-[1000] space-y-2">
              <Badge className={mapLayers.find((l) => l.id === activeLayer)?.color}>
                <Layers className="h-3 w-3 mr-1" />
                {mapLayers.find((l) => l.id === activeLayer)?.name}
              </Badge>
            </div>
          )}

          {/* Additional Layer Indicators */}
          {mapLoaded && !isLoading && (
            <div className="absolute top-3 right-3 z-[1000] space-y-2">
              {showTraffic && (
                <Badge variant="outline" className="bg-background/80 block">
                  <Car className="h-3 w-3 mr-1" />
                  Traffic
                </Badge>
              )}
              {showWeatherStations && (
                <Badge variant="outline" className="bg-background/80 block">
                  <Thermometer className="h-3 w-3 mr-1" />
                  Stations
                </Badge>
              )}
            </div>
          )}

          {/* Location Info */}
          {mapLoaded && !isLoading && (
            <div className="absolute bottom-3 left-3 z-[1000]">
              <Badge variant="secondary" className="bg-background/90">
                <MapPin className="h-3 w-3 mr-1" />
                {location.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium">Precipitation</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium">Wind</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium">Traffic</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium">Stations</div>
          </div>
        </div>

        {/* Map Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            • <strong>Pan:</strong> Click and drag to move around
          </p>
          <p>
            • <strong>Zoom:</strong> Mouse wheel or zoom buttons
          </p>
          <p>
            • <strong>Info:</strong> Click markers for detailed information
          </p>
          <p>
            • <strong>Layers:</strong> Toggle different weather data overlays
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
