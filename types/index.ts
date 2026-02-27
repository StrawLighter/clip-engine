export type Plan = "free" | "pro";

export type SourceType = "youtube" | "podcast" | "upload" | "twitch";

export type SourceStatus =
  | "pending"
  | "transcribing"
  | "analyzing"
  | "ready"
  | "error";

export type ClipStatus = "suggested" | "approved" | "exported" | "posted";

export type Platform = "tiktok" | "instagram" | "youtube_shorts";

export interface Profile {
  id: string;
  email: string;
  plan: Plan;
  clips_this_month: number;
  stripe_customer_id: string | null;
  brand_voice: string | null;
  default_platforms: Platform[];
  created_at: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Source {
  id: string;
  user_id: string;
  title: string;
  source_url: string | null;
  source_type: SourceType;
  duration_seconds: number | null;
  transcript: string | null;
  transcript_segments: TranscriptSegment[] | null;
  status: SourceStatus;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Clip {
  id: string;
  source_id: string;
  user_id: string;
  title: string;
  hook: string;
  start_time: number;
  end_time: number;
  duration_seconds: number;
  viral_score: number;
  why_viral: string;
  caption_tiktok: string;
  caption_instagram: string;
  caption_youtube: string;
  hashtags: string[];
  status: ClipStatus;
  video_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

export interface ClipSuggestion {
  title: string;
  hook: string;
  start_time: number;
  end_time: number;
  viral_score: number;
  why_viral: string;
  caption_tiktok: string;
  caption_instagram: string;
  caption_youtube: string;
  hashtags: string[];
}
