# Test OpenAI Prompts for True Crime Niche

This guide shows you how to test the OpenAI prompts before deploying.

## Quick Test

### Option 1: Using the Test Script (Recommended)

```bash
# Make sure you have your OpenAI API key set
export OPENAI_API_KEY="sk-your-key-here"

# Run the test script
node test-true-crime-prompts.js
```

This will show you:
- ✅ 5 trending true crime topics
- ✅ Full video prompt for top topic
- ✅ Caption and hashtags
- ✅ Platform-specific variations
- ✅ Cost estimation

### Option 2: OpenAI Playground

1. Go to [OpenAI Playground](https://platform.openai.com/playground)
2. Select **GPT-4 Turbo**
3. Set temperature to **0.8**
4. Paste this prompt:

```
As a viral content researcher, identify 5 trending topics that would make great short-form video content (45-60 seconds).
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
]
```

## Expected Output Example

### Trending Topics:

```json
[
  {
    "topic": "The Isdal Woman Mystery - Norway's Unsolved Death",
    "keywords": ["isdal woman", "norway mystery", "unidentified victim", "cold case", "spy theory"],
    "score": 8.9,
    "reason": "Trending on TikTok's true crime community with new documentary releasing. The case involves an unidentified woman found burned in 1970, encrypted notes, disguises, and possible espionage. Videos getting 5M+ views."
  },
  {
    "topic": "Brian Shaffer - The Man Who Vanished from a Bar",
    "keywords": ["brian shaffer", "missing person", "surveillance mystery", "ohio state", "unexplained disappearance"],
    "score": 8.6,
    "reason": "Medical student who entered a bar on camera but never left. All exits were monitored. Viral on mystery channels with 10M+ combined views discussing impossible disappearance."
  },
  {
    "topic": "The Phoenix Lights Mass UFO Sighting",
    "keywords": ["phoenix lights", "ufo sighting", "mass sighting", "unexplained phenomenon", "1997"],
    "score": 8.4,
    "reason": "Resurging with new Pentagon UFO hearings. Thousands witnessed V-shaped craft over Phoenix. Government explanations debunked. Perfect timing with current UFO disclosure trends."
  },
  {
    "topic": "The Somerton Man - Solved After 73 Years?",
    "keywords": ["somerton man", "taman shud", "australia mystery", "dna breakthrough", "cold case solved"],
    "score": 9.0,
    "reason": "DNA genealogy recently identified the victim after 73 years. Trending massively as one of Australia's greatest mysteries potentially solved. Videos hitting 15M+ views."
  },
  {
    "topic": "The Hinterkaifeck Murders - Family Killed on Isolated Farm",
    "keywords": ["hinterkaifeck", "unsolved murder", "germany", "farmhouse murder", "mystery"],
    "score": 8.2,
    "reason": "German family brutally murdered in 1922, killer may have stayed in house for days after. Creepy details going viral on horror/mystery channels. Timeless horror story with modern interest."
  }
]
```

### Video Prompt for Top Topic:

```json
{
  "prompt": "A haunting 50-second exploration of the Isdal Woman mystery. Open with a slow, ominous zoom into a black and white photograph of a burned, desolate Norwegian valley in 1970. Transition to flickering images of coded notes and encrypted messages appearing and disappearing. Show a mysterious silhouette of a woman in different wigs and disguises morphing between looks. Display scattered evidence: passports with different identities, a suitcase with removed labels, bottles of poison. Camera pans across a misty Norwegian fjord at dusk. Quick cuts of newspaper headlines in Norwegian with dates. Show a burned body outline on the ground, tastefully done. Include floating text overlays: 'NOVEMBER 1970', '8 FAKE IDENTITIES', 'ENCRYPTED NOTES', 'WHO WAS SHE?'. End with a close-up of her sketch fading into static. Dark Scandinavian noir aesthetic, desaturated colors with cold blue tones, vintage film grain, mystery thriller cinematography, atmospheric fog effects.",

  "caption": "The Isdal Woman is Norway's most chilling unsolved mystery 🇳🇴😱 In 1970, a woman's burned body was found in a remote valley. Here's what makes it IMPOSSIBLE: She had 8 different fake identities, encrypted notes that have NEVER been decoded, all labels removed from her belongings, and a suitcase full of disguises. Police think she was a spy. Her face was reconstructed but nobody recognized her. 53 years later, we still don't know who she was or why she died. Some say she knew too much... 👁️",

  "hashtags": [
    "TrueCrime",
    "IsdalWoman",
    "UnsolvedMystery",
    "Norway",
    "ColdCase",
    "Mystery",
    "TrueCrimeCommunity",
    "Unsolved",
    "SpyStory",
    "CreepyStories",
    "TrueCrimeTikTok",
    "MysteryTok",
    "Conspiracy",
    "RealStory",
    "UnexplainedPhenomena",
    "DarkHistory",
    "Mysterious",
    "ViralStory",
    "TrueStory",
    "Creepy"
  ],

  "platforms": {
    "twitter": "The Isdal Woman: Found burned in Norway, 1970. Had 8 fake identities, encrypted notes never decoded, all labels removed. Police suspect spy. Face reconstructed - nobody recognized her. 53 years later, still Jane Doe. Thread 🧵👇 #TrueCrime #Mystery",

    "instagram": "THE ISDAL WOMAN MYSTERY 🇳🇴\n\nNovember 1970. A woman's body found burned in a remote Norwegian valley.\n\nWhat makes it TERRIFYING:\n\n🔍 8 different fake identities\n🔍 Encrypted notes NEVER decoded\n🔍 All clothing labels removed\n🔍 Suitcase full of disguises\n🔍 Police believe she was a SPY\n🔍 Face reconstructed - nobody knew her\n🔍 53 years later - still unidentified\n\nWho was she? What did she know?\n\nSome mysteries are meant to stay buried...\n\n#TrueCrime #IsdalWoman #Norway #UnsolvedMystery #ColdCase #Mystery #SpyStory",

    "tiktok": "The Isdal Woman is Norway's SCARIEST mystery 🇳🇴😱 Found burned in 1970 with 8 fake IDs, encrypted notes that have NEVER been cracked, and disguises everywhere. Police think she was a SPY who knew too much. 53 years later - still Jane Doe 👁️ #TrueCrime #Mystery #IsdalWoman #Norway #Unsolved #Creepy #Spy #MysteryTok",

    "youtube": "The Isdal Woman: Norway's Unsolved Spy Mystery\n\nIn 1970, a woman was found burned in a remote Norwegian valley. She had 8 fake identities, encrypted notes that remain undecoded, and a suitcase full of disguises. Police suspect espionage. Her face was reconstructed, but nobody recognized her. 53 years later, the Isdal Woman remains one of the world's most compelling unsolved mysteries.\n\n#TrueCrime #IsdalWoman #UnsolvedMystery #Shorts"
  }
}
```

## What This Means for Your Bot

When the automated cron job runs every 6 hours, it will:

1. **Research** trending true crime topics using OpenAI
2. **Select** the topic with highest virality score
3. **Generate** a detailed video prompt like above
4. **Create** the video using Kling AI with that prompt
5. **Post** to all your active platforms with optimized captions
6. **Track** analytics and notify you via Telegram

## Cost Analysis

- **Trending Topics Request**: ~800 tokens = $0.016
- **Video Prompt Request**: ~1,200 tokens = $0.024
- **Total per video**: ~$0.04
- **Per day (4 videos)**: ~$0.16
- **Per month**: ~$4.80

Very affordable for the automation!

## Tips for Testing

### Try Different Variations:

```javascript
// More specific
await openAIService.researchTrendingTopics('unsolved murder mysteries from the 1970s-1990s')

// Broader
await openAIService.researchTrendingTopics('true crime and paranormal phenomena')

// Recent focus
await openAIService.researchTrendingTopics('recent true crime cases and cold case breakthroughs')

// Geographic focus
await openAIService.researchTrendingTopics('American true crime mysteries and serial killers')
```

### Check Response Quality:

Good signs:
- ✅ High virality scores (8.0+)
- ✅ Specific case names (not generic)
- ✅ Clear reasons why it's trending
- ✅ Detailed video prompts with atmosphere
- ✅ Engaging captions with hooks

Bad signs:
- ❌ Generic topics ("Famous murders")
- ❌ No trending context
- ❌ Vague video prompts
- ❌ Boring captions

## Next Steps

1. Run `node test-true-crime-prompts.js` to see real outputs
2. If you like the results, deploy to Vercel
3. The bot will automatically generate videos with these prompts every 6 hours
4. Monitor via dashboard and Telegram notifications

---

The true crime niche is proven to go viral. Your bot is now optimized for maximum engagement! 🔥
