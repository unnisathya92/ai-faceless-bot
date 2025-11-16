import axios from 'axios'
import { AccountCredentials } from '@/types'
import { retryWithBackoff } from '@/lib/utils'

export class YouTubeService {
  private credentials: AccountCredentials

  constructor(credentials: AccountCredentials) {
    this.credentials = credentials
  }

  /**
   * Post video to YouTube Shorts
   */
  async postVideo(
    videoBuffer: Buffer,
    title: string,
    description: string,
    hashtags: string[]
  ): Promise<{ postId: string; postUrl: string }> {
    try {
      const accessToken = await this.getAccessToken()

      // Step 1: Initialize upload
      const metadata = {
        snippet: {
          title: title.substring(0, 100), // YouTube title limit
          description: `${description}\n\n${hashtags.map(h => `#${h}`).join(' ')}`,
          categoryId: '22', // People & Blogs
          tags: hashtags,
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      }

      const response = await retryWithBackoff(async () => {
        return await axios.post(
          'https://www.googleapis.com/upload/youtube/v3/videos',
          videoBuffer,
          {
            params: {
              part: 'snippet,status',
              uploadType: 'multipart',
            },
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'video/mp4',
              'X-Upload-Content-Length': videoBuffer.length.toString(),
            },
          }
        )
      })

      const videoId = response.data.id

      // Mark as Short by adding #Shorts to description
      await this.updateVideoDescription(videoId, accessToken, description, hashtags)

      return {
        postId: videoId,
        postUrl: `https://youtube.com/shorts/${videoId}`,
      }
    } catch (error: any) {
      console.error('YouTube posting error:', error.response?.data || error.message)
      throw new Error(`Failed to post to YouTube: ${error.message}`)
    }
  }

  /**
   * Update video description to include #Shorts
   */
  private async updateVideoDescription(
    videoId: string,
    accessToken: string,
    description: string,
    hashtags: string[]
  ): Promise<void> {
    try {
      await axios.put(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          id: videoId,
          snippet: {
            description: `${description}\n\n#Shorts ${hashtags.map(h => `#${h}`).join(' ')}`,
          },
        },
        {
          params: {
            part: 'snippet',
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      console.error('Failed to update description:', error)
    }
  }

  /**
   * Get or refresh access token
   */
  private async getAccessToken(): Promise<string> {
    if (this.credentials.accessToken) {
      return this.credentials.accessToken
    }

    // Refresh token if needed
    if (this.credentials.refreshToken) {
      try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          refresh_token: this.credentials.refreshToken,
          grant_type: 'refresh_token',
        })

        return response.data.access_token
      } catch (error: any) {
        throw new Error(`Failed to refresh YouTube token: ${error.message}`)
      }
    }

    throw new Error('No valid YouTube credentials')
  }

  /**
   * Get video metrics
   */
  async getMetrics(videoId: string): Promise<{
    views: number
    likes: number
    comments: number
  }> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'statistics',
            id: videoId,
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      const stats = response.data.items[0]?.statistics

      return {
        views: parseInt(stats?.viewCount || '0'),
        likes: parseInt(stats?.likeCount || '0'),
        comments: parseInt(stats?.commentCount || '0'),
      }
    } catch (error) {
      return { views: 0, likes: 0, comments: 0 }
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()

      await axios.get(
        'https://www.googleapis.com/youtube/v3/channels',
        {
          params: {
            part: 'snippet',
            mine: true,
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
      return true
    } catch (error) {
      return false
    }
  }
}
