import axios from 'axios'
import { AccountCredentials } from '@/types'

export class SnapchatService {
  private credentials: AccountCredentials

  constructor(credentials: AccountCredentials) {
    this.credentials = credentials
  }

  /**
   * Post video to Snapchat Spotlight
   * Note: Snapchat's API is more limited. This is a simplified version.
   */
  async postVideo(
    videoUrl: string,
    caption: string
  ): Promise<{ postId: string; postUrl: string }> {
    try {
      const accessToken = this.credentials.accessToken

      if (!accessToken) {
        throw new Error('Snapchat access token not configured')
      }

      // Snapchat Creative Kit API (simplified)
      // Note: Actual implementation may require Snap Kit SDK integration
      const response = await axios.post(
        'https://adsapi.snapchat.com/v1/creatives',
        {
          name: caption.substring(0, 50),
          type: 'SNAP_AD',
          video_url: videoUrl,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const creativeId = response.data.id

      return {
        postId: creativeId,
        postUrl: `https://www.snapchat.com/add/${creativeId}`,
      }
    } catch (error: any) {
      console.error('Snapchat posting error:', error.response?.data || error.message)
      throw new Error(`Failed to post to Snapchat: ${error.message}`)
    }
  }

  /**
   * Get metrics (limited on Snapchat)
   */
  async getMetrics(creativeId: string): Promise<{
    views: number
    shares: number
  }> {
    try {
      const response = await axios.get(
        `https://adsapi.snapchat.com/v1/creatives/${creativeId}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
          },
        }
      )

      return {
        views: response.data.impressions || 0,
        shares: response.data.shares || 0,
      }
    } catch (error) {
      return { views: 0, shares: 0 }
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await axios.get(
        'https://adsapi.snapchat.com/v1/me',
        {
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
