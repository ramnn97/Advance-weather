"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TreePine, Award, Flame, Calendar, Star, CheckCircle, Trophy } from "lucide-react"
import { useState, useEffect } from "react"

interface GamificationProps {
  userId?: string
}

export function EnvironmentalGamification({ userId = "demo-user" }: GamificationProps) {
  const [userStats, setUserStats] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserStats()
    fetchAchievements()
    fetchLeaderboard()
  }, [userId])

  const fetchUserStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/gamification/stats?userId=${userId}`)
      const data = await response.json()
      setUserStats(data)
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`/api/gamification/achievements?userId=${userId}`)
      const data = await response.json()
      setAchievements(data.achievements || [])
    } catch (error) {
      console.error("Error fetching achievements:", error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/gamification/leaderboard")
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    }
  }

  const checkIn = async () => {
    try {
      const response = await fetch("/api/gamification/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      if (data.success) {
        fetchUserStats()
        fetchAchievements()
      }
    } catch (error) {
      console.error("Error checking in:", error)
    }
  }

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "tree":
        return <TreePine className="h-4 w-4" />
      case "streak":
        return <Flame className="h-4 w-4" />
      case "checkin":
        return <Calendar className="h-4 w-4" />
      case "air":
        return <Award className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "tree":
        return "bg-green-500"
      case "streak":
        return "bg-orange-500"
      case "checkin":
        return "bg-blue-500"
      case "air":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading && !userStats) {
    return (
      <Card className="overflow-hidden border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Eco Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="h-5 w-5" />
          Eco Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold">{userStats?.trees || 0}</div>
            <div className="text-xs text-muted-foreground">Digital Trees</div>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold">{userStats?.streak || 0}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{userStats?.checkins || 0}</div>
            <div className="text-xs text-muted-foreground">Check-ins</div>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold">{userStats?.badges || 0}</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
        </div>

        {/* Daily Check-in */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">Daily Weather Check-in</h4>
              <p className="text-sm text-muted-foreground">
                {userStats?.checkedInToday ? "✅ Checked in today!" : "Check in to earn a digital tree"}
              </p>
            </div>
            <Button
              onClick={checkIn}
              disabled={userStats?.checkedInToday}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              {userStats?.checkedInToday ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <TreePine className="h-4 w-4 mr-2" />
              )}
              {userStats?.checkedInToday ? "Done" : "Check In"}
            </Button>
          </div>
        </div>

        {/* Progress to Next Badge */}
        {userStats?.nextBadge && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress to {userStats.nextBadge.name}</span>
              <span className="text-sm text-muted-foreground">
                {userStats.nextBadge.progress}/{userStats.nextBadge.target}
              </span>
            </div>
            <Progress value={(userStats.nextBadge.progress / userStats.nextBadge.target) * 100} />
          </div>
        )}

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                  <div className={`${getBadgeColor(achievement.type)} rounded-full p-2 text-white`}>
                    {getBadgeIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +{achievement.points}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </h4>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.name}</div>
                  </div>
                  <div className="text-sm font-medium">{user.trees} 🌳</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
