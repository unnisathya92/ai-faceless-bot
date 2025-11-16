"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, RefreshCw, Play } from 'lucide-react'
import Link from 'next/link'

interface Video {
  id: string
  prompt: string
  fileUrl?: string
  thumbnailUrl?: string
  status: string
  createdAt: string
  metadata: any
  posts: any[]
}

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      // This would be a real API endpoint
      // For now, we'll show a placeholder
      setVideos([])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Content Library</h1>
              <p className="text-muted-foreground">Browse and manage your generated videos</p>
            </div>
            <Button onClick={fetchVideos}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Play className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Videos will appear here once they are generated. The automated system will create new videos every 6 hours, or you can manually generate videos from the dashboard.
              </p>
              <Link href="/dashboard/config">
                <Button>
                  Configure Platforms
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">
                      {video.metadata?.topic || 'Video'}
                    </CardTitle>
                    <Badge
                      variant={video.status === 'COMPLETED' ? 'success' : 'warning'}
                    >
                      {video.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {video.prompt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {video.fileUrl && (
                    <video
                      src={video.fileUrl}
                      className="w-full rounded-lg"
                      controls
                      poster={video.thumbnailUrl}
                    />
                  )}

                  <div className="flex flex-wrap gap-1">
                    {video.metadata?.hashtags?.slice(0, 5).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Repost
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
