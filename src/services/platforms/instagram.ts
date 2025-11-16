import axios from 'axios'
import { AccountCredentials } from '@/types'
import { retryWithBackoff } from '@/lib/utils'

export class InstagramService {
  private credentials: AccountCredentials

  constructor(credentials: AccountCredentials) {
    this.credentials = credentials
  }

  /**
   * Post reel to Instagram
   */
  async postVideo(
    videoUrl: string,
    caption: string,
    hashtags: string[]
  ): Promise<{ postId: string; postUrl: string }> {
    try {
      const accessToken = this.credentials.accessToken
      const businessAccountId = this.credentials.clientId // Using clientId to store business account ID

      if (!accessToken || !businessAccountId) {
        throw new Error('Instagram credentials not properly configured')
      }

      // Step 1: Create media container
      const containerResponse = await retryWithBackoff(async () => {
        return await axios.post(
          `https://graph.facebook.com/v18.0/${businessAccountId}/media`,
          {
            media_type: 'REELS',
            video_url: videoUrl,
            caption: `${caption}\n\n${hashtags.map(h => `#${h}`).join(' ')}`,
          },
          {
            params: {
              access_token: accessToken,
            },
          }
        )
      })

      const creationId = containerResponse.data.id

      // Step 2: Wait for processing (polling)
      await this.waitForProcessing(creationId, accessToken)

      // Step 3: Publish the media
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${businessAccountId}/media_publish`,
        {
          creation_id: creationId,
        },
        {
          params: {
            access_token: accessToken,
          },
        }
      )

      const mediaId = publishResponse.data.id

      return {
        postId: mediaId,
        postUrl: `https://www.instagram.com/p/${mediaId}`,
      }
    } catch (error: any) {
      console.error('Instagram posting error:', error.response?.data || error.message)
      throw new Error(`Failed to post to Instagram: ${error.message}`)
    }
  }

  /**
   * Wait for video processing to complete
   */
  private async waitForProcessing(creationId: string, accessToken: string): Promise<void> {
    const maxAttempts = 30 // 5 minutes max
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v18.0/${creationId}`,
          {
            params: {
              fields: 'status_code',
              access_token: accessToken,
            },
          }
        )

        const statusCode = response.data.status_code

        if (statusCode === 'FINISHED') {
          return
        } else if (statusCode === 'ERROR') {
          throw new Error('Video processing failed')
        }

        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000))
        attempts++
      } catch (error: any) {
        throw new Error(`Processing check failed: ${error.message}`)
      }
    }

    throw new Error('Video processing timeout')
  }

  /**
   * Get reel insights/metrics
   */
  async getMetrics(mediaId: string): Promise<{
    views: number
    likes: number
    comments: number
    shares: number
    saves: number
  }> {
    try {
      const accessToken = this.credentials.accessToken

      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${mediaId}/insights`,
        {
          params: {
            metric: 'plays,likes,comments,shares,saved',
            access_token: accessToken,
          },
        }
      )

      const data = response.data.data
      const metrics = {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
      }

      data.forEach((item: any) => {
        switch (item.name) {
          case 'plays':
            metrics.views = item.values[0]?.value || 0
            break
          case 'likes':
            metrics.likes = item.values[0]?.value || 0
            break
          case 'comments':
            metrics.comments = item.values[0]?.value || 0
            break
          case 'shares':
            metrics.shares = item.values[0]?.value || 0
            break
          case 'saved':
            metrics.saves = item.values[0]?.value || 0
            break
        }
      })

      return metrics
    } catch (error) {
      return { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 }
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const accessToken = this.credentials.accessToken
      const businessAccountId = this.credentials.clientId

      await axios.get(
        `https://graph.facebook.com/v18.0/${businessAccountId}`,
        {
          params: {
            fields: 'id,username',
            access_token: accessToken,
          },
        }
      )
      return true
    } catch (error) {
      return false
    }
  }
}
