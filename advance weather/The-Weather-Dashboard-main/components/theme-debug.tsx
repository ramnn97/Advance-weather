"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ThemeDebug() {
  const { theme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-64 z-50 opacity-80 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Theme Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Theme:</span>
          <Badge variant="outline">{theme}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Resolved:</span>
          <Badge variant="outline">{resolvedTheme}</Badge>
        </div>
        <div className="flex justify-between">
          <span>System:</span>
          <Badge variant="outline">{systemTheme}</Badge>
        </div>
        <div className="flex justify-between">
          <span>HTML Class:</span>
          <Badge variant="outline">{document.documentElement.className || "none"}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
