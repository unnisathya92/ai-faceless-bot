import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openAIService } from '@/services/openai'
import { klingAI } from '@/services/kling-ai'
import { telegramService } from '@/services/telegram'

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, customPrompt } = await request.json()

    let videoPromptData
    let prompt

    if (customPrompt) {
      // Use custom prompt
      prompt = customPrompt
      videoPromptData = {
        prompt: customPrompt,
        caption: '',
        hashtags: [],
        platforms: {},
      }
    } else {
      // Generate prompt using OpenAI
      videoPromptData = await openAIService.generateVideoPrompt(
        topic,
        keywords || []
      )
      prompt = videoPromptData.prompt
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        prompt,
        status: 'PENDING',
        metadata: {
          topic,
          keywords,
          caption: videoPromptData.caption,
          hashtags: videoPromptData.hashtags,
          platforms: videoPromptData.platforms,
        },
      },
    })

    // Start video generation with Kling AI
    const klingResponse = await klingAI.generateVideo({
      prompt,
      duration: 50,
      aspectRatio: '9:16',
    })

    // Update video with job ID
    await prisma.video.update({
      where: { id: video.id },
      data: {
        klingJobId: klingResponse.jobId,
        status: 'GENERATING',
      },
    })

    // Send notification
    await telegramService.sendNotification(
      'VIDEO_GENERATED',
      'Video Generation Started',
      `Video generation started for topic: ${topic}\nJob ID: ${klingResponse.jobId}`
    )

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        jobId: klingResponse.jobId,
        estimatedTime: klingResponse.estimatedTime,
      },
    })
  } catch (error: any) {
    console.error('Video generation error:', error)
    await telegramService.notifyError(error.message, 'Video Generation')

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
