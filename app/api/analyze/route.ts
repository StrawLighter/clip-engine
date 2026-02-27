import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI, CLIP_DETECTION_PROMPT } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ClipSuggestion } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceId } = await request.json();

    // Check plan limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, clips_this_month")
      .eq("id", user.id)
      .single();

    if (profile?.plan === "free" && (profile.clips_this_month || 0) >= 3) {
      return NextResponse.json(
        { error: "Free plan limit reached. Upgrade to Pro for unlimited clips." },
        { status: 403 }
      );
    }

    // Get the source with transcript
    const { data: source } = await supabase
      .from("sources")
      .select("*")
      .eq("id", sourceId)
      .eq("user_id", user.id)
      .single();

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    if (!source.transcript && !source.transcript_segments) {
      return NextResponse.json(
        { error: "No transcript available. Please transcribe first." },
        { status: 400 }
      );
    }

    // Update status
    await getSupabaseAdmin()
      .from("sources")
      .update({ status: "analyzing" })
      .eq("id", sourceId);

    // Build transcript text for AI
    let transcriptText = source.transcript || "";
    if (source.transcript_segments) {
      transcriptText = source.transcript_segments
        .map(
          (seg: { start: number; end: number; text: string }) =>
            `[${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s] ${seg.text}`
        )
        .join("\n");
    }

    // Get brand voice for personalization
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("brand_voice")
      .eq("id", user.id)
      .single();

    const brandContext = userProfile?.brand_voice
      ? `\n\nBrand voice context: ${userProfile.brand_voice}`
      : "";

    // Call OpenAI for clip detection
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: CLIP_DETECTION_PROMPT + brandContext,
        },
        {
          role: "user",
          content: `Here is the transcript:\n\n${transcriptText}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    let suggestions: ClipSuggestion[];

    try {
      const parsed = JSON.parse(responseText);
      suggestions = Array.isArray(parsed) ? parsed : parsed.clips || [];
    } catch {
      console.error("Failed to parse AI response:", responseText);
      await getSupabaseAdmin()
        .from("sources")
        .update({ status: "ready" })
        .eq("id", sourceId);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Insert clips into database
    const clipInserts = suggestions.map((clip) => ({
      source_id: sourceId,
      user_id: user.id,
      title: clip.title,
      hook: clip.hook,
      start_time: clip.start_time,
      end_time: clip.end_time,
      duration_seconds: clip.end_time - clip.start_time,
      viral_score: clip.viral_score,
      why_viral: clip.why_viral,
      caption_tiktok: clip.caption_tiktok,
      caption_instagram: clip.caption_instagram,
      caption_youtube: clip.caption_youtube,
      hashtags: clip.hashtags,
      status: "suggested" as const,
    }));

    const { error: insertError } = await getSupabaseAdmin()
      .from("clips")
      .insert(clipInserts);

    if (insertError) {
      console.error("Failed to insert clips:", insertError);
    }

    // Update clips_this_month count
    await getSupabaseAdmin()
      .from("profiles")
      .update({
        clips_this_month: (profile?.clips_this_month || 0) + suggestions.length,
      })
      .eq("id", user.id);

    // Update source status back to ready
    await getSupabaseAdmin()
      .from("sources")
      .update({ status: "ready" })
      .eq("id", sourceId);

    return NextResponse.json({
      success: true,
      clips_generated: suggestions.length,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
