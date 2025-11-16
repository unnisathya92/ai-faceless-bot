import { Platform } from '@prisma/client'
import { AccountCredentials } from '@/types'
import { TwitterService } from './twitter'
import { InstagramService } from './instagram'
import { TikTokService } from './tiktok'
import { YouTubeService } from './youtube'
import { FacebookService } from './facebook'
import { SnapchatService } from './snapchat'

export type PlatformService =
  | TwitterService
  | InstagramService
  | TikTokService
  | YouTubeService
  | FacebookService
  | SnapchatService

export function getPlatformService(
  platform: Platform,
  credentials: AccountCredentials
): PlatformService {
  switch (platform) {
    case 'TWITTER':
      return new TwitterService(credentials)
    case 'INSTAGRAM':
      return new InstagramService(credentials)
    case 'TIKTOK':
      return new TikTokService(credentials)
    case 'YOUTUBE':
      return new YouTubeService(credentials)
    case 'FACEBOOK':
      return new FacebookService(credentials)
    case 'SNAPCHAT':
      return new SnapchatService(credentials)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

export {
  TwitterService,
  InstagramService,
  TikTokService,
  YouTubeService,
  FacebookService,
  SnapchatService,
}
