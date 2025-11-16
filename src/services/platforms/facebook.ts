import axios from 'axios'
import { AccountCredentials } from '@/types'
import { retryWithBackoff } from '@/lib/utils'

export class FacebookService {
  private credentials: AccountCredentials

  constructor(credentials: AccountCredentials) {
    this.credentials = credentials
  }

  /**
   * Post video to Facebook Page
   */
  async postVideo(
    videoUrl: string,
    caption: string,
    hashtags: string[]
  ): Promise<{ postId: string; postUrl: string }> {
    try {
      const accessToken = this.credentials.accessToken
      const pageId = this.credentials.clientId // Using clientId to store page ID

      if (!accessToken || !pageId) {
        throw new Error('Facebook credentials not properly configured')
      }

      // Post video to Facebook Page
      const response = await retryWithBackoff(async () => {
        return await axios.post(
          `https://graph.facebook.com/v18.0/${pageId}/videos`,
          {
            file_url: videoUrl,
            description: `${caption}\n\n${hashtags.map(h => `#${h}`).join(' ')}`,
            published: true,
          },
          {
            params: {
              access_token: accessToken,
            },
          }
        )
      })

      const videoId = response.data.id

      return {
        postId: videoId,
        postUrl: `https://www.facebook.com/${pageId}/videos/${videoId}`,
      }
    } catch (error: any) {
      console.error('Facebook posting error:', error.response?.data || error.message)
      throw new Error(`Failed to post to Facebook: ${error.message}`)
    }
  }

  /**
   * Get video metrics
   */
  async getMetrics(videoId: string): Promise<{
    views: number
    likes: number
    comments: number
    shares: number
  }> {
    try {
      const accessToken = this.credentials.accessToken

      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${videoId}/insights`,
        {
          params: {
            metric: 'total_video_views,post_reactions_by_type_total,post_video_comments,post_video_shares',
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
      }

      data.forEach((item: any) => {
        switch (item.name) {
          case 'total_video_views':
            metrics.views = item.values[0]?.value || 0
            break
          case 'post_reactions_by_type_total':
            const reactions = item.values[0]?.value || {}
            metrics.likes = Object.values(reactions).reduce((a: any, b: any) => a + b, 0) as number
            break
          case 'post_video_comments':
            metrics.comments = item.values[0]?.value || 0
            break
          case 'post_video_shares':
            metrics.shares = item.values[0]?.value || 0
            break
        }
      })

      return metrics
    } catch (error) {
      return { views: 0, likes: 0, comments: 0, shares: 0 }
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const accessToken = this.credentials.accessToken
      const pageId = this.credentials.clientId

      await axios.get(
        `https://graph.facebook.com/v18.0/${pageId}`,
        {
          params: {
            fields: 'id,name',
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
