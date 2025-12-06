import axios from 'axios'
import { retryWithBackoff } from '@/lib/utils'

const KLING_ACCESS_KEY = process.env.KLING_AI_ACCESS_KEY
const KLING_SECRET_KEY = process.env.KLING_AI_SECRET_KEY
const KLING_API_URL = process.env.KLING_AI_API_URL || 'https://api.kling.ai/v1'

export interface KlingVideoRequest {
  prompt: string
  duration?: number // 45-60 seconds
  aspectRatio?: '16:9' | '9:16' | '1:1'
  style?: string
  negativePrompt?: string
}

export interface KlingVideoResponse {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  thumbnailUrl?: string
  estimatedTime?: number
  error?: string
}

class KlingAIService {
  private accessKey: string
  private secretKey: string
  private baseUrl: string

  constructor() {
    if (!KLING_ACCESS_KEY || !KLING_SECRET_KEY) {
      throw new Error('KLING_AI_ACCESS_KEY and KLING_AI_SECRET_KEY are not configured')
    }
    this.accessKey = KLING_ACCESS_KEY
    this.secretKey = KLING_SECRET_KEY
    this.baseUrl = KLING_API_URL
  }

  /**
   * Generate a video using Kling AI
   */
  async generateVideo(request: KlingVideoRequest): Promise<KlingVideoResponse> {
    try {
      const response = await retryWithBackoff(async () => {
        return await axios.post(
          `${this.baseUrl}/videos/generate`,
          {
            prompt: request.prompt,
            duration: request.duration || 50,
            aspect_ratio: request.aspectRatio || '9:16',
            style: request.style || 'realistic',
            negative_prompt: request.negativePrompt || '',
          },
          {
            headers: {
              'X-Api-Key': this.accessKey,
              'X-Api-Secret': this.secretKey,
              'Content-Type': 'application/json',
            },
          }
        )
      })

      return {
        jobId: response.data.job_id || response.data.id,
        status: 'pending',
        estimatedTime: response.data.estimated_time || 300, // 5 minutes default
      }
    } catch (error: any) {
      console.error('Kling AI generation error:', error)
      throw new Error(`Failed to generate video: ${error.message}`)
    }
  }

  /**
   * Check the status of a video generation job
   */
  async checkJobStatus(jobId: string): Promise<KlingVideoResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/videos/status/${jobId}`,
        {
          headers: {
            'X-Api-Key': this.accessKey,
            'X-Api-Secret': this.secretKey,
          },
        }
      )

      const data = response.data

      return {
        jobId,
        status: this.mapStatus(data.status),
        videoUrl: data.video_url || data.url,
        thumbnailUrl: data.thumbnail_url,
        error: data.error,
      }
    } catch (error: any) {
      console.error('Kling AI status check error:', error)
      return {
        jobId,
        status: 'failed',
        error: error.message,
      }
    }
  }

  /**
   * Download video from Kling AI
   */
  async downloadVideo(videoUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
      })
      return Buffer.from(response.data)
    } catch (error: any) {
      console.error('Video download error:', error)
      throw new Error(`Failed to download video: ${error.message}`)
    }
  }

  /**
   * Get account credits/usage
   */
  async getCredits(): Promise<{ remaining: number; total: number }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/account/credits`,
        {
          headers: {
            'X-Api-Key': this.accessKey,
            'X-Api-Secret': this.secretKey,
          },
        }
      )

      return {
        remaining: response.data.remaining || 0,
        total: response.data.total || 0,
      }
    } catch (error: any) {
      console.error('Credits check error:', error)
      return { remaining: 0, total: 0 }
    }
  }

  private mapStatus(status: string): 'pending' | 'processing' | 'completed' | 'failed' {
    const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
      'pending': 'pending',
      'queued': 'pending',
      'processing': 'processing',
      'running': 'processing',
      'completed': 'completed',
      'success': 'completed',
      'failed': 'failed',
      'error': 'failed',
    }
    return statusMap[status.toLowerCase()] || 'pending'
  }
}

export const klingAI = new KlingAIService()
