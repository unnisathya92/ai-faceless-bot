/**
 * Test script to see what OpenAI returns for true crime niche
 * Run: node test-true-crime-prompts.js
 */

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

async function testTrendingTopics() {
  console.log('🔍 Testing Trending Topics Research...\n');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a viral content researcher and social media expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `As a viral content researcher, identify 5 trending topics that would make great short-form video content (45-60 seconds).
Focus on the niche: true crime mysteries and unexplained phenomena

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
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    const topics = JSON.parse(content);

    console.log('✅ TRENDING TOPICS FOR TRUE CRIME:\n');
    topics.forEach((topic, i) => {
      console.log(`${i + 1}. ${topic.topic}`);
      console.log(`   📊 Virality Score: ${topic.score}/10`);
      console.log(`   🔑 Keywords: ${topic.keywords.join(', ')}`);
      console.log(`   💡 Why Trending: ${topic.reason}`);
      console.log('');
    });

    // Test video prompt generation for top topic
    console.log('\n🎬 Testing Video Prompt Generation for Top Topic...\n');

    const topTopic = topics[0];
    const promptResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating viral video content and AI prompts. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Create a highly detailed video generation prompt for an AI video generator (Kling AI).

Topic: ${topTopic.topic}
Keywords: ${topTopic.keywords.join(', ')}

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
        }
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    const videoContent = JSON.parse(promptResponse.choices[0].message.content);

    console.log('✅ VIDEO PROMPT GENERATED:\n');
    console.log('📹 Kling AI Prompt:');
    console.log(`   ${videoContent.prompt}\n`);

    console.log('📝 Caption:');
    console.log(`   ${videoContent.caption}\n`);

    console.log('🏷️ Hashtags:');
    console.log(`   ${videoContent.hashtags.join(' #')}\n`);

    console.log('📱 Platform-Specific Captions:\n');
    console.log('🐦 Twitter:');
    console.log(`   ${videoContent.platforms.twitter}\n`);
    console.log('📸 Instagram:');
    console.log(`   ${videoContent.platforms.instagram}\n`);
    console.log('🎵 TikTok:');
    console.log(`   ${videoContent.platforms.tiktok}\n`);
    console.log('▶️ YouTube:');
    console.log(`   ${videoContent.platforms.youtube}\n`);

    console.log('💰 ESTIMATED COSTS:');
    console.log(`   Trending Topics: ~$0.01-0.02 per request`);
    console.log(`   Video Prompt: ~$0.02-0.03 per request`);
    console.log(`   Total per video: ~$0.03-0.05`);
    console.log(`   Monthly (120 videos): ~$3.60-6.00`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testTrendingTopics();
