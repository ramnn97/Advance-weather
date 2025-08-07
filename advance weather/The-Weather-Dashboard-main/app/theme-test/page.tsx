import { ThemeTest } from "@/components/theme-test"
import { ThemeDebug } from "@/components/theme-debug"

export default function ThemeTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Theme Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ThemeTest />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Color Samples</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-4 bg-background border rounded">Background</div>
            <div className="p-4 bg-foreground text-background rounded">Foreground</div>
            <div className="p-4 bg-card border rounded">Card</div>
            <div className="p-4 bg-muted rounded">Muted</div>
            <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
            <div className="p-4 bg-accent text-accent-foreground rounded">Accent</div>
            <div className="p-4 bg-destructive text-destructive-foreground rounded">Destructive</div>
          </div>
        </div>
      </div>
      <ThemeDebug />
    </div>
  )
}
