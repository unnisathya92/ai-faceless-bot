import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getPlatformService } from '@/services/platforms'
import { telegramService } from '@/services/telegram'
import { klingAI } from '@/services/kling-ai'
import { Platform } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { videoId, accountIds, customCaption, customHashtags } = await request.json()

    // Get video
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    })

    if (!video || !video.fileUrl) {
      return NextResponse.json(
        { error: 'Video not found or not ready' },
        { status: 404 }
      )
    }

    // Get accounts
    const accounts = await prisma.account.findMany({
      where: {
        id: { in: accountIds },
        isActive: true,
      },
    })

    const metadata = video.metadata as any
    const results = []

    // Post to each account
    for (const account of accounts) {
      try {
        const credentials = decrypt(account.credentials)
        const platformService = getPlatformService(account.platform, credentials)

        // Get platform-specific caption
        const caption = customCaption || metadata?.caption || ''
        const hashtags = customHashtags || metadata?.hashtags || []

        // Download video if needed
        let videoBuffer: Buffer | undefined
        if (account.platform === 'TWITTER' || account.platform === 'YOUTUBE') {
          videoBuffer = await klingAI.downloadVideo(video.fileUrl)
        }

        // Post based on platform
        let result

        if (account.platform === 'TWITTER' && videoBuffer) {
          result = await (platformService as any).postVideo(videoBuffer, caption, hashtags)
        } else if (account.platform === 'YOUTUBE' && videoBuffer) {
          const title = caption.substring(0, 100)
          result = await (platformService as any).postVideo(videoBuffer, title, caption, hashtags)
        } else {
          // For other platforms, use video URL
          result = await (platformService as any).postVideo(video.fileUrl, caption, hashtags)
        }

        // Create post record
        const post = await prisma.post.create({
          data: {
            videoId: video.id,
            accountId: account.id,
            platform: account.platform,
            postUrl: result.postUrl,
            postId: result.postId,
            caption,
            hashtags,
            status: 'POSTED',
            postedAt: new Date(),
          },
        })

        // Update account
        await prisma.account.update({
          where: { id: account.id },
          data: {
            lastPostTime: new Date(),
            totalPosts: { increment: 1 },
            status: 'ACTIVE',
          },
        })

        // Send success notification
        await telegramService.notifyPostSuccess(account.platform, result.postUrl)

        results.push({
          platform: account.platform,
          success: true,
          postUrl: result.postUrl,
          postId: post.id,
        })
      } catch (error: any) {
        console.error(`Posting to ${account.platform} failed:`, error)

        // Create failed post record
        await prisma.post.create({
          data: {
            videoId: video.id,
            accountId: account.id,
            platform: account.platform,
            caption: customCaption || '',
            hashtags: customHashtags || [],
            status: 'FAILED',
            errorMessage: error.message,
          },
        })

        // Update account status
        await prisma.account.update({
          where: { id: account.id },
          data: {
            status: 'ERROR',
            errorMessage: error.message,
          },
        })

        // Send failure notification
        await telegramService.notifyPostFailed(account.platform, error.message)

        results.push({
          platform: account.platform,
          success: false,
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
