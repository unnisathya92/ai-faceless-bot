import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openAIService } from '@/services/openai'
import { klingAI } from '@/services/kling-ai'
import { decrypt } from '@/lib/encryption'
import { getPlatformService } from '@/services/platforms'
import { telegramService } from '@/services/telegram'
import { put } from '@vercel/blob'
import { wait } from '@/lib/utils'

/**
 * Cron job to automatically generate and post videos
 * Configure in vercel.json to run every 6 hours
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting automated content generation...')

    // Step 1: Research trending topics
    const topics = await openAIService.researchTrendingTopics('true crime mysteries and unexplained phenomena')

    if (topics.length === 0) {
      return NextResponse.json({ error: 'No trending topics found' }, { status: 500 })
    }

    // Select the top topic
    const topTopic = topics.sort((a, b) => b.score - a.score)[0]

    // Save trending topic
    const trendingTopic = await prisma.trendingTopic.create({
      data: {
        topic: topTopic.topic,
        keywords: topTopic.keywords,
        source: 'openai',
        score: topTopic.score,
      },
    })

    // Step 2: Generate video prompt
    const videoPrompt = await openAIService.generateVideoPrompt(
      topTopic.topic,
      topTopic.keywords
    )

    // Step 3: Create video record and start generation
    const video = await prisma.video.create({
      data: {
        prompt: videoPrompt.prompt,
        status: 'GENERATING',
        metadata: {
          topic: topTopic.topic,
          keywords: topTopic.keywords,
          caption: videoPrompt.caption,
          hashtags: videoPrompt.hashtags,
          platforms: videoPrompt.platforms,
        },
      },
    })

    // Step 4: Generate video with Kling AI
    const klingResponse = await klingAI.generateVideo({
      prompt: videoPrompt.prompt,
      duration: 50,
      aspectRatio: '9:16',
    })

    await prisma.video.update({
      where: { id: video.id },
      data: { klingJobId: klingResponse.jobId },
    })

    // Step 5: Wait for video generation (with timeout)
    let videoReady = false
    let attempts = 0
    const maxAttempts = 60 // 10 minutes max

    while (!videoReady && attempts < maxAttempts) {
      await wait(10000) // Wait 10 seconds

      const status = await klingAI.checkJobStatus(klingResponse.jobId)

      if (status.status === 'completed' && status.videoUrl) {
        // Download and upload to Vercel Blob
        const videoBuffer = await klingAI.downloadVideo(status.videoUrl)
        const blob = await put(`videos/${video.id}.mp4`, videoBuffer, {
          access: 'public',
          contentType: 'video/mp4',
        })

        await prisma.video.update({
          where: { id: video.id },
          data: {
            status: 'COMPLETED',
            fileUrl: blob.url,
            thumbnailUrl: status.thumbnailUrl,
            generatedAt: new Date(),
          },
        })

        videoReady = true
      } else if (status.status === 'failed') {
        throw new Error('Video generation failed')
      }

      attempts++
    }

    if (!videoReady) {
      throw new Error('Video generation timeout')
    }

    // Step 6: Get active accounts
    const accounts = await prisma.account.findMany({
      where: {
        isActive: true,
        status: 'ACTIVE',
      },
    })

    // Step 7: Post to all active platforms
    const videoRecord = await prisma.video.findUnique({
      where: { id: video.id },
    })

    if (!videoRecord || !videoRecord.fileUrl) {
      throw new Error('Video not ready for posting')
    }

    const metadata = videoRecord.metadata as any
    const postResults = []

    for (const account of accounts) {
      try {
        const credentials = decrypt(account.credentials)
        const platformService = getPlatformService(account.platform, credentials)

        const caption = metadata.platforms?.[account.platform.toLowerCase()] || metadata.caption
        const hashtags = metadata.hashtags || []

        let result
        if (account.platform === 'TWITTER' || account.platform === 'YOUTUBE') {
          const videoBuffer = await klingAI.downloadVideo(videoRecord.fileUrl)
          if (account.platform === 'TWITTER') {
            result = await (platformService as any).postVideo(videoBuffer, caption, hashtags)
          } else {
            result = await (platformService as any).postVideo(videoBuffer, caption.substring(0, 100), caption, hashtags)
          }
        } else {
          result = await (platformService as any).postVideo(videoRecord.fileUrl, caption, hashtags)
        }

        await prisma.post.create({
          data: {
            videoId: videoRecord.id,
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

        await prisma.account.update({
          where: { id: account.id },
          data: {
            lastPostTime: new Date(),
            totalPosts: { increment: 1 },
          },
        })

        await telegramService.notifyPostSuccess(account.platform, result.postUrl)

        postResults.push({ platform: account.platform, success: true })
      } catch (error: any) {
        console.error(`Posting to ${account.platform} failed:`, error)
        await telegramService.notifyPostFailed(account.platform, error.message)
        postResults.push({ platform: account.platform, success: false, error: error.message })
      }
    }

    // Update trending topic as used
    await prisma.trendingTopic.update({
      where: { id: trendingTopic.id },
      data: {
        used: true,
        usedInVideoId: video.id,
      },
    })

    return NextResponse.json({
      success: true,
      topic: topTopic.topic,
      videoId: video.id,
      postResults,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    await telegramService.notifyError(error.message, 'Automated Content Generation')

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
