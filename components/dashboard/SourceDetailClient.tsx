"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDuration } from "@/lib/utils";
import type { Source, Clip } from "@/types";
import ClipCard from "./ClipCard";
import TranscriptPanel from "./TranscriptPanel";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Loader2,
  RefreshCw,
  Film,
} from "lucide-react";
import Link from "next/link";

interface SourceDetailClientProps {
  source: Source;
  clips: Clip[];
}

export default function SourceDetailClient({
  source,
  clips: initialClips,
}: SourceDetailClientProps) {
  const [clips, setClips] = useState(initialClips);
  const [generating, setGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const router = useRouter();

  const handleTimestampClick = useCallback((time: number) => {
    setCurrentTime(time);
    // If there's a video player, seek to this time
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = time;
      video.play();
    }
  }, []);

  async function handleApprove(clipId: string) {
    const supabase = createClient();
    await supabase
      .from("clips")
      .update({ status: "approved" })
      .eq("id", clipId);

    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, status: "approved" } : c))
    );
  }

  async function handleDismiss(clipId: string) {
    const supabase = createClient();
    await supabase.from("clips").delete().eq("id", clipId);
    setClips((prev) => prev.filter((c) => c.id !== clipId));
  }

  async function handleGenerateMore() {
    setGenerating(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: source.id }),
      });

      if (res.ok) {
        router.refresh();
        // Refetch clips
        const supabase = createClient();
        const { data } = await supabase
          .from("clips")
          .select("*")
          .eq("source_id", source.id)
          .order("viral_score", { ascending: false });
        if (data) setClips(data as Clip[]);
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleExport() {
    const approved = clips.filter(
      (c) => c.status === "approved" || c.status === "exported"
    );
    const exportData = approved.map((c) => ({
      title: c.title,
      hook: c.hook,
      start_time: c.start_time,
      end_time: c.end_time,
      duration_seconds: c.duration_seconds,
      viral_score: c.viral_score,
      captions: {
        tiktok: c.caption_tiktok,
        instagram: c.caption_instagram,
        youtube: c.caption_youtube,
      },
      hashtags: c.hashtags,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${source.title || "clips"}-export.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Mark as exported
    const supabase = createClient();
    for (const clip of approved) {
      await supabase
        .from("clips")
        .update({ status: "exported" })
        .eq("id", clip.id);
    }
    setClips((prev) =>
      prev.map((c) =>
        c.status === "approved" ? { ...c, status: "exported" } : c
      )
    );
  }

  const approvedCount = clips.filter(
    (c) => c.status === "approved" || c.status === "exported"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard"
            className="mt-1 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{source.title || "Untitled"}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-neutral-400">
              <span className="capitalize">{source.source_type}</span>
              {source.duration_seconds && (
                <span>{formatDuration(source.duration_seconds)}</span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  source.status === "ready"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : source.status === "error"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {source.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateMore}
            disabled={generating || source.status !== "ready"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generating ? "Generating..." : "Generate Clips"}
          </button>
          {approvedCount > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export ({approvedCount})
            </button>
          )}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Video + Transcript */}
        <div className="space-y-4">
          {/* Video Player Placeholder */}
          {source.source_url && source.source_type === "youtube" ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(source.source_url)}?start=${Math.floor(currentTime)}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Film className="w-12 h-12 text-neutral-700" />
            </div>
          )}

          {/* Transcript */}
          {source.transcript_segments &&
          source.transcript_segments.length > 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Transcript
              </h3>
              <TranscriptPanel
                segments={source.transcript_segments}
                currentTime={currentTime}
                onSegmentClick={handleTimestampClick}
              />
            </div>
          ) : source.transcript ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Transcript
              </h3>
              <div className="h-[400px] overflow-y-auto text-sm text-neutral-400 leading-relaxed">
                {source.transcript}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center">
              {source.status === "transcribing" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                  <p className="text-sm text-neutral-400">
                    Transcribing audio...
                  </p>
                </div>
              ) : source.status === "pending" ? (
                <p className="text-sm text-neutral-500">
                  Waiting to process...
                </p>
              ) : (
                <p className="text-sm text-neutral-500">
                  No transcript available
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Clip Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-300">
              Clip Suggestions ({clips.length})
            </h3>
            {clips.length > 0 && (
              <button
                onClick={() => router.refresh()}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            )}
          </div>

          {clips.length > 0 ? (
            <div className="space-y-3">
              {clips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  onApprove={handleApprove}
                  onDismiss={handleDismiss}
                  onTimestampClick={handleTimestampClick}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-800 p-10 text-center">
              <Sparkles className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-400 mb-1">No clips yet</p>
              <p className="text-xs text-neutral-500">
                {source.status === "ready"
                  ? 'Click "Generate Clips" to find viral moments'
                  : "Clips will appear after processing completes"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || "";
}
