import OpenAI from 'openai'
import { retryWithBackoff } from '@/lib/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface TrendingTopicResult {
  topic: string
  keywords: string[]
  score: number
  reason: string
}

export interface VideoPromptResult {
  prompt: string
  caption: string
  hashtags: string[]
  platforms: {
    twitter?: string
    instagram?: string
    tiktok?: string
    youtube?: string
  }
}

class OpenAIService {
  /**
   * Research trending topics using GPT-4
   */
  async researchTrendingTopics(niche?: string): Promise<TrendingTopicResult[]> {
    try {
      const prompt = `As a viral content researcher, identify 5 trending topics that would make great short-form video content (45-60 seconds).
      ${niche ? `Focus on the niche: ${niche}` : 'Consider general trending topics across social media.'}

      For each topic, provide:
      1. The topic/trend name
      2. Key keywords related to it
      3. A virality score (1-10)
      4. Why it's trending

      Return ONLY valid JSON in this exact format:
      [
        {
          "topic": "topic name",
          "keywords": ["keyword1", "keyword2", "keyword3"],
          "score": 8.5,
          "reason": "why this is trending"
        }
      ]`

      const response = await retryWithBackoff(async () => {
        return await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a viral content researcher and social media expert. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        })
      })

      const content = response.choices[0]?.message?.content || '[]'
      const topics = JSON.parse(content)
      return topics
    } catch (error: any) {
      console.error('Trending topics research error:', error)
      return []
    }
  }

  /**
   * Generate optimized video prompt for Kling AI
   */
  async generateVideoPrompt(topic: string, keywords: string[]): Promise<VideoPromptResult> {
    try {
      const prompt = `Create a highly detailed video generation prompt for an AI video generator (Kling AI).

      Topic: ${topic}
      Keywords: ${keywords.join(', ')}

      Requirements:
      1. The prompt should describe a 45-60 second video
      2. Be highly detailed and descriptive
      3. Include visual elements, camera movements, and style
      4. Make it engaging and viral-worthy
      5. Suitable for short-form platforms (TikTok, Instagram Reels, YouTube Shorts)

      Also create:
      - A compelling caption for the video
      - 15-20 relevant hashtags
      - Platform-specific variations for Twitter, Instagram, TikTok, and YouTube

      Return ONLY valid JSON in this exact format:
      {
        "prompt": "detailed video generation prompt here",
        "caption": "engaging caption here",
        "hashtags": ["hashtag1", "hashtag2"],
        "platforms": {
          "twitter": "twitter-specific caption (280 chars max)",
          "instagram": "instagram caption with line breaks",
          "tiktok": "tiktok caption with trending sounds reference",
          "youtube": "youtube shorts title and description"
        }
      }`

      const response = await retryWithBackoff(async () => {
        return await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at creating viral video content and AI prompts. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.9,
          max_tokens: 2000,
        })
      })

      const content = response.choices[0]?.message?.content || '{}'
      const result = JSON.parse(content)
      return result
    } catch (error: any) {
      console.error('Video prompt generation error:', error)
      throw new Error(`Failed to generate prompt: ${error.message}`)
    }
  }

  /**
   * Optimize existing caption for a specific platform
   */
  async optimizeCaption(caption: string, platform: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a social media expert. Optimize captions for ${platform}.`,
          },
          {
            role: 'user',
            content: `Optimize this caption for ${platform}: ${caption}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      return response.choices[0]?.message?.content || caption
    } catch (error) {
      return caption
    }
  }

  /**
   * Generate hashtags for a topic
   */
  async generateHashtags(topic: string, count: number = 15): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Generate trending, relevant hashtags. Return only a JSON array of strings.',
          },
          {
            role: 'user',
            content: `Generate ${count} trending hashtags for: ${topic}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      })

      const content = response.choices[0]?.message?.content || '[]'
      return JSON.parse(content)
    } catch (error) {
      return []
    }
  }

  /**
   * Analyze video performance and suggest improvements
   */
  async analyzePerformance(
    metrics: { views: number; likes: number; shares: number; comments: number },
    caption: string
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a social media analytics expert.',
          },
          {
            role: 'user',
            content: `Analyze this post performance and suggest improvements:
            Views: ${metrics.views}
            Likes: ${metrics.likes}
            Shares: ${metrics.shares}
            Comments: ${metrics.comments}
            Caption: ${caption}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      return response.choices[0]?.message?.content || 'No analysis available'
    } catch (error) {
      return 'Analysis unavailable'
    }
  }
}

export const openAIService = new OpenAIService()
