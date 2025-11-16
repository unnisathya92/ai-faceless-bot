import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { klingAI } from '@/services/kling-ai'
import { put } from '@vercel/blob'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID required' },
        { status: 400 }
      )
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Check Kling AI status if still generating
    if (video.status === 'GENERATING' && video.klingJobId) {
      const status = await klingAI.checkJobStatus(video.klingJobId)

      if (status.status === 'completed' && status.videoUrl) {
        // Download video
        const videoBuffer = await klingAI.downloadVideo(status.videoUrl)

        // Upload to Vercel Blob
        const blob = await put(`videos/${videoId}.mp4`, videoBuffer, {
          access: 'public',
          contentType: 'video/mp4',
        })

        // Update video record
        await prisma.video.update({
          where: { id: videoId },
          data: {
            status: 'COMPLETED',
            fileUrl: blob.url,
            thumbnailUrl: status.thumbnailUrl,
            generatedAt: new Date(),
          },
        })

        return NextResponse.json({
          status: 'COMPLETED',
          fileUrl: blob.url,
          thumbnailUrl: status.thumbnailUrl,
        })
      } else if (status.status === 'failed') {
        await prisma.video.update({
          where: { id: videoId },
          data: {
            status: 'FAILED',
            errorMessage: status.error || 'Generation failed',
          },
        })

        return NextResponse.json({
          status: 'FAILED',
          error: status.error,
        })
      }
    }

    return NextResponse.json({
      status: video.status,
      fileUrl: video.fileUrl,
      thumbnailUrl: video.thumbnailUrl,
    })
  } catch (error: any) {
    console.error('Video status check error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
