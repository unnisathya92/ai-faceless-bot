import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d, all

    const now = new Date()
    let startDate = new Date(0) // Beginning of time

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
    }

    // Get dashboard stats
    const [
      totalVideos,
      totalPosts,
      activeAccounts,
      analytics,
      recentPosts,
    ] = await Promise.all([
      prisma.video.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.post.count({
        where: {
          createdAt: { gte: startDate },
          status: 'POSTED',
        },
      }),
      prisma.account.count({
        where: { isActive: true },
      }),
      prisma.analytics.findMany({
        where: { createdAt: { gte: startDate } },
        include: {
          post: {
            include: {
              video: true,
              account: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        where: {
          createdAt: { gte: startDate },
          status: 'POSTED',
        },
        include: {
          video: true,
          account: true,
          analytics: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    // Calculate totals
    const totalViews = analytics.reduce((sum, a) => sum + a.views, 0)
    const totalLikes = analytics.reduce((sum, a) => sum + a.likes, 0)
    const totalShares = analytics.reduce((sum, a) => sum + a.shares, 0)
    const totalComments = analytics.reduce((sum, a) => sum + a.comments, 0)

    // Calculate engagement rate
    const totalEngagement = totalViews > 0
      ? ((totalLikes + totalShares + totalComments) / totalViews) * 100
      : 0

    // Group by platform
    const platformStats = analytics.reduce((acc: any, a) => {
      if (!acc[a.platform]) {
        acc[a.platform] = {
          platform: a.platform,
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          posts: 0,
        }
      }
      acc[a.platform].views += a.views
      acc[a.platform].likes += a.likes
      acc[a.platform].shares += a.shares
      acc[a.platform].comments += a.comments
      acc[a.platform].posts += 1
      return acc
    }, {})

    return NextResponse.json({
      summary: {
        totalVideos,
        totalPosts,
        totalViews,
        totalEngagement: parseFloat(totalEngagement.toFixed(2)),
        activeAccounts,
      },
      platformStats: Object.values(platformStats),
      recentPosts: recentPosts.map(post => ({
        id: post.id,
        platform: post.platform,
        postUrl: post.postUrl,
        postedAt: post.postedAt,
        caption: post.caption,
        metrics: post.analytics[0] || {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
        },
      })),
    })
  } catch (error: any) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
