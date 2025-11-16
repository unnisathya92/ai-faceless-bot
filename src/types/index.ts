import { Platform, AccountStatus, VideoStatus, PostStatus } from '@prisma/client'

export interface AccountCredentials {
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  refreshToken?: string
  bearerToken?: string
  clientId?: string
  clientSecret?: string
  username?: string
  password?: string
}

export interface AccountSettings {
  postingEnabled: boolean
  autoHashtags: boolean
  customHashtags: string[]
  captionTemplate: string
  postingTimes?: string[]
  maxDailyPosts: number
  aspectRatio?: string
  videoQuality?: string
}

export interface PlatformConfig {
  platform: Platform
  name: string
  icon: string
  color: string
  isActive: boolean
  hasAccount: boolean
  status: AccountStatus
  lastPostTime?: Date
  totalPosts: number
}

export interface VideoGenerationRequest {
  prompt: string
  duration?: number
  aspectRatio?: string
  style?: string
}

export interface VideoGenerationResponse {
  jobId: string
  status: string
  estimatedTime?: number
}

export interface PostMetrics {
  views: number
  likes: number
  shares: number
  comments: number
  saves: number
  engagement: number
  revenue: number
}

export interface DashboardStats {
  totalVideos: number
  totalPosts: number
  totalViews: number
  totalEngagement: number
  activeAccounts: number
  pendingJobs: number
}

export interface NotificationData {
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  metadata?: any
}

export { Platform, AccountStatus, VideoStatus, PostStatus }
