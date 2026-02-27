import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

    // Get the source
    const { data: source } = await supabase
      .from("sources")
      .select("*")
      .eq("id", sourceId)
      .eq("user_id", user.id)
      .single();

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    // Update status to transcribing
    await getSupabaseAdmin()
      .from("sources")
      .update({ status: "transcribing" })
      .eq("id", sourceId);

    // For YouTube URLs, try to get transcript via YouTube's API or a transcript service
    // For V1, we'll use OpenAI Whisper if audio is available, or simulate with a placeholder
    // In production, you'd integrate yt-dlp or a transcript extraction service here.

    if (source.source_type === "youtube" && source.source_url) {
      // In production: extract audio from YouTube URL, then send to Whisper
      // For now, update status to ready so user can manually provide transcript
      // or trigger analysis directly

      await getSupabaseAdmin()
        .from("sources")
        .update({
          status: "ready",
          // In production, populate these from the actual transcript:
          // transcript: fullText,
          // transcript_segments: segments,
        })
        .eq("id", sourceId);

      return NextResponse.json({ success: true, status: "ready" });
    }

    // For uploaded files: would send to Whisper API
    // const openai = getOpenAI();
    // const transcription = await openai.audio.transcriptions.create({
    //   file: audioFile,
    //   model: "whisper-1",
    //   response_format: "verbose_json",
    //   timestamp_granularities: ["segment"],
    // });

    await getSupabaseAdmin()
      .from("sources")
      .update({ status: "ready" })
      .eq("id", sourceId);

    return NextResponse.json({ success: true, status: "ready" });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
