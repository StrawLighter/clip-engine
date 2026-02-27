import OpenAI from "openai";

let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return _openai;
}

export const CLIP_DETECTION_PROMPT = `You are a viral content expert. Analyze this transcript and identify the top 5-10 moments that would make great short-form clips (30-90 seconds). For each clip, provide:

1. start_time and end_time (from the transcript timestamps)
2. A scroll-stopping hook (the first line that grabs attention)
3. A viral_score from 1-100 based on: emotional impact, controversy/hot take, actionable advice, storytelling arc, quotability
4. A brief "why_viral" explanation
5. Platform-specific captions for TikTok (casual, emoji-heavy), Instagram (polished, hashtag-rich), and YouTube Shorts (SEO-optimized)
6. 5-10 relevant hashtags

Prioritize moments with: strong opinions, personal stories, surprising data, actionable tips, humor, emotional peaks, and "quotable" statements.

Return as a JSON array with this exact structure:
[
  {
    "title": "Short descriptive title",
    "hook": "The scroll-stopping opening line",
    "start_time": 0.0,
    "end_time": 60.0,
    "viral_score": 85,
    "why_viral": "Brief explanation of why this moment is viral-worthy",
    "caption_tiktok": "Casual TikTok caption with emojis",
    "caption_instagram": "Polished Instagram caption with hashtags",
    "caption_youtube": "SEO-optimized YouTube Shorts description",
    "hashtags": ["tag1", "tag2", "tag3"]
  }
]

Return ONLY the JSON array, no other text.`;
