"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeTest() {
  const { setTheme, theme } = useTheme()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Sun className="h-4 w-4" />
            <span className="text-xs">Light</span>
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Moon className="h-4 w-4" />
            <span className="text-xs">Dark</span>
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Monitor className="h-4 w-4" />
            <span className="text-xs">System</span>
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="p-3 bg-background border rounded">Background</div>
          <div className="p-3 bg-card border rounded">Card</div>
          <div className="p-3 bg-muted border rounded">Muted</div>
          <div className="p-3 bg-primary text-primary-foreground rounded">Primary</div>
          <div className="p-3 bg-secondary text-secondary-foreground rounded">Secondary</div>
        </div>
      </CardContent>
    </Card>
  )
}
