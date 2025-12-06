"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Video, TrendingUp, Users, BarChart3, Settings, Library, PlayCircle } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalVideos: number
  totalPosts: number
  totalViews: number
  totalEngagement: number
  activeAccounts: number
}

interface PlatformStat {
  platform: string
  views: number
  likes: number
  posts: number
}

interface ServiceStatus {
  telegram: { configured: boolean }
  openai: { configured: boolean }
  klingAI: { configured: boolean }
  blob: { configured: boolean }
  twitter: { configured: boolean }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([])
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchServiceStatus()
    const interval = setInterval(fetchAnalytics, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics?period=7d')
      const data = await res.json()
      setStats(data.summary)
      setPlatformStats(data.platformStats || [])
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setServiceStatus(data)
    } catch (error) {
      console.error('Failed to fetch service status:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Faceless Video Bot</h1>
              <p className="text-muted-foreground">Automated Content Generation Dashboard</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/config">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 py-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-primary font-medium">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/dashboard/config" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Settings className="h-4 w-4" />
              Configuration
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Link>
            <Link href="/dashboard/library" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Library className="h-4 w-4" />
              Content Library
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalVideos || 0}</div>
                  <p className="text-xs text-muted-foreground">Generated this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                  <p className="text-xs text-muted-foreground">Across all platforms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(stats?.totalViews || 0)}</div>
                  <p className="text-xs text-muted-foreground">Combined reach</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalEngagement.toFixed(2) || 0}%</div>
                  <p className="text-xs text-muted-foreground">Average rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeAccounts || 0}</div>
                  <p className="text-xs text-muted-foreground">Connected platforms</p>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Views and engagement by platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformStats.length > 0 ? (
                    platformStats.map((platform) => (
                      <div key={platform.platform} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{platform.platform}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {platform.posts} posts
                            </span>
                          </div>
                          <span className="font-medium">{formatNumber(platform.views)} views</span>
                        </div>
                        <Progress
                          value={(platform.views / (stats?.totalViews || 1)) * 100}
                          className="h-2"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No platform data available yet
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your content and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/config">
                    <Button className="w-full" variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Platforms
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline" onClick={() => window.location.href = '/dashboard/library'}>
                    <Video className="mr-2 h-4 w-4" />
                    View Content Library
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => window.location.href = '/dashboard/analytics'}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Automated posting schedule and system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automated Posting</p>
                      <p className="text-sm text-muted-foreground">Posts every 6 hours</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Video Generation</p>
                      <p className="text-sm text-muted-foreground">Kling AI integration</p>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">AI Content Research</p>
                      <p className="text-sm text-muted-foreground">OpenAI GPT-4</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Telegram bot</p>
                    </div>
                    <Badge variant={serviceStatus?.telegram?.configured ? "success" : "warning"}>
                      {serviceStatus?.telegram?.configured ? "Connected" : "Not Configured"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
