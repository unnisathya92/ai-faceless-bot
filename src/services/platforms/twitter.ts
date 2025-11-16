import axios from 'axios'
import { AccountCredentials } from '@/types'
import { retryWithBackoff } from '@/lib/utils'

export class TwitterService {
  private credentials: AccountCredentials

  constructor(credentials: AccountCredentials) {
    this.credentials = credentials
  }

  /**
   * Post video to Twitter/X
   */
  async postVideo(
    videoBuffer: Buffer,
    caption: string,
    hashtags: string[]
  ): Promise<{ postId: string; postUrl: string }> {
    try {
      // Step 1: Upload media
      const mediaId = await this.uploadMedia(videoBuffer)

      // Step 2: Create tweet with media
      const tweet = await retryWithBackoff(async () => {
        return await axios.post(
          'https://api.twitter.com/2/tweets',
          {
            text: `${caption}\n\n${hashtags.map(h => `#${h}`).join(' ')}`,
            media: {
              media_ids: [mediaId],
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${this.credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
      })

      const tweetId = tweet.data.data.id
      const username = await this.getUsername()

      return {
        postId: tweetId,
        postUrl: `https://twitter.com/${username}/status/${tweetId}`,
      }
    } catch (error: any) {
      console.error('Twitter posting error:', error.response?.data || error.message)
      throw new Error(`Failed to post to Twitter: ${error.message}`)
    }
  }

  /**
   * Upload media to Twitter
   */
  private async uploadMedia(videoBuffer: Buffer): Promise<string> {
    try {
      // Initialize upload
      const initResponse = await axios.post(
        'https://upload.twitter.com/1.1/media/upload.json',
        {
          command: 'INIT',
          total_bytes: videoBuffer.length,
          media_type: 'video/mp4',
          media_category: 'tweet_video',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.bearerToken}`,
          },
        }
      )

      const mediaId = initResponse.data.media_id_string

      // Upload in chunks
      const chunkSize = 5 * 1024 * 1024 // 5MB chunks
      let segmentIndex = 0

      for (let i = 0; i < videoBuffer.length; i += chunkSize) {
        const chunk = videoBuffer.slice(i, Math.min(i + chunkSize, videoBuffer.length))

        await axios.post(
          'https://upload.twitter.com/1.1/media/upload.json',
          {
            command: 'APPEND',
            media_id: mediaId,
            media: chunk.toString('base64'),
            segment_index: segmentIndex,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.credentials.bearerToken}`,
            },
          }
        )

        segmentIndex++
      }

      // Finalize upload
      await axios.post(
        'https://upload.twitter.com/1.1/media/upload.json',
        {
          command: 'FINALIZE',
          media_id: mediaId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.bearerToken}`,
          },
        }
      )

      return mediaId
    } catch (error: any) {
      throw new Error(`Media upload failed: ${error.message}`)
    }
  }

  /**
   * Get authenticated user's username
   */
  private async getUsername(): Promise<string> {
    try {
      const response = await axios.get(
        'https://api.twitter.com/2/users/me',
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.bearerToken}`,
          },
        }
      )
      return response.data.data.username
    } catch (error) {
      return 'user'
    }
  }

  /**
   * Get tweet metrics
   */
  async getMetrics(tweetId: string): Promise<{
    views: number
    likes: number
    retweets: number
    replies: number
  }> {
    try {
      const response = await axios.get(
        `https://api.twitter.com/2/tweets/${tweetId}`,
        {
          params: {
            'tweet.fields': 'public_metrics',
          },
          headers: {
            'Authorization': `Bearer ${this.credentials.bearerToken}`,
          },
        }
      )

      const metrics = response.data.data.public_metrics

      return {
        views: metrics.impression_count || 0,
        likes: metrics.like_count || 0,
        retweets: metrics.retweet_count || 0,
        replies: metrics.reply_count || 0,
      }
    } catch (error) {
      return { views: 0, likes: 0, retweets: 0, replies: 0 }
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${this.credentials.bearerToken}`,
        },
      })
      return true
    } catch (error) {
      return false
    }
  }
}
