import axios from 'axios'
import { AccountCredentials } from '@/types'
import { retryWithBackoff } from '@/lib/utils'

export class TikTokService {
  private credentials: AccountCredentials

  constructor(credentials: AccountCredentials) {
    this.credentials = credentials
  }

  /**
   * Post video to TikTok
   */
  async postVideo(
    videoUrl: string,
    caption: string,
    hashtags: string[]
  ): Promise<{ postId: string; postUrl: string }> {
    try {
      const accessToken = this.credentials.accessToken

      if (!accessToken) {
        throw new Error('TikTok access token not configured')
      }

      // TikTok Content Posting API
      const response = await retryWithBackoff(async () => {
        return await axios.post(
          'https://open.tiktokapis.com/v2/post/publish/video/init/',
          {
            post_info: {
              title: caption,
              description: `${caption}\n\n${hashtags.map(h => `#${h}`).join(' ')}`,
              privacy_level: 'PUBLIC_TO_EVERYONE',
              disable_duet: false,
              disable_comment: false,
              disable_stitch: false,
              video_cover_timestamp_ms: 1000,
            },
            source_info: {
              source: 'FILE_URL',
              video_url: videoUrl,
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
      })

      const publishId = response.data.data.publish_id

      // Wait for publishing to complete
      const status = await this.waitForPublishing(publishId)

      return {
        postId: publishId,
        postUrl: status.share_url || `https://www.tiktok.com/@user/video/${publishId}`,
      }
    } catch (error: any) {
      console.error('TikTok posting error:', error.response?.data || error.message)
      throw new Error(`Failed to post to TikTok: ${error.message}`)
    }
  }

  /**
   * Wait for video publishing to complete
   */
  private async waitForPublishing(publishId: string): Promise<any> {
    const maxAttempts = 30
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const response = await axios.post(
          'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
          {
            publish_id: publishId,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const status = response.data.data.status

        if (status === 'PUBLISH_COMPLETE') {
          return response.data.data
        } else if (status === 'FAILED') {
          throw new Error('Publishing failed')
        }

        await new Promise(resolve => setTimeout(resolve, 10000))
        attempts++
      } catch (error: any) {
        throw new Error(`Status check failed: ${error.message}`)
      }
    }

    throw new Error('Publishing timeout')
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
      const response = await axios.post(
        'https://open.tiktokapis.com/v2/research/video/query/',
        {
          filters: {
            video_id: videoId,
          },
          fields: ['video_id', 'like_count', 'comment_count', 'share_count', 'view_count'],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = response.data.data.videos[0]

      return {
        views: data?.view_count || 0,
        likes: data?.like_count || 0,
        comments: data?.comment_count || 0,
        shares: data?.share_count || 0,
      }
    } catch (error) {
      return { views: 0, likes: 0, comments: 0, shares: 0 }
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await axios.get(
        'https://open.tiktokapis.com/v2/user/info/',
        {
          params: {
            fields: 'display_name,avatar_url',
          },
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
          },
        }
      )
      return true
    } catch (error) {
      return false
    }
  }
}
