"use client";

import { useState } from "react";
import { formatTimestamp, viralScoreColor, viralScoreBg, cn } from "@/lib/utils";
import type { Clip } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Copy,
  Clock,
} from "lucide-react";

interface ClipCardProps {
  clip: Clip;
  onApprove?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onTimestampClick?: (time: number) => void;
}

export default function ClipCard({
  clip,
  onApprove,
  onDismiss,
  onTimestampClick,
}: ClipCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function copyCaption(platform: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Viral Score */}
          <div
            className={cn(
              "flex-shrink-0 w-12 h-12 rounded-lg border flex flex-col items-center justify-center",
              viralScoreBg(clip.viral_score)
            )}
          >
            <span
              className={cn(
                "text-lg font-bold leading-none",
                viralScoreColor(clip.viral_score)
              )}
            >
              {clip.viral_score}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Hook */}
            <p className="font-semibold text-sm leading-snug mb-1.5">
              {clip.hook}
            </p>

            {/* Timestamp + Duration */}
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <button
                onClick={() => onTimestampClick?.(clip.start_time)}
                className="flex items-center gap-1 hover:text-violet-400 transition-colors"
              >
                <Clock className="w-3 h-3" />
                {formatTimestamp(clip.start_time)} -{" "}
                {formatTimestamp(clip.end_time)}
              </button>
              <span>
                {Math.round(clip.duration_seconds)}s
              </span>
            </div>

            {/* Why Viral */}
            <p className="text-xs text-neutral-400 mt-1.5">{clip.why_viral}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {clip.status === "suggested" && (
            <>
              <button
                onClick={() => onApprove?.(clip.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-colors"
              >
                <Check className="w-3 h-3" />
                Approve
              </button>
              <button
                onClick={() => onDismiss?.(clip.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 text-xs font-medium hover:bg-neutral-700 transition-colors"
              >
                <X className="w-3 h-3" />
                Dismiss
              </button>
            </>
          )}
          {clip.status === "approved" && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Check className="w-3 h-3" />
              Approved
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-neutral-400 text-xs hover:text-white transition-colors"
          >
            Captions
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded captions */}
      {expanded && (
        <div className="border-t border-neutral-800 p-4 space-y-3">
          {[
            { platform: "TikTok", caption: clip.caption_tiktok },
            { platform: "Instagram", caption: clip.caption_instagram },
            { platform: "YouTube", caption: clip.caption_youtube },
          ].map(({ platform, caption }) => (
            <div key={platform}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-neutral-400">
                  {platform}
                </span>
                <button
                  onClick={() => copyCaption(platform, caption)}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-violet-400 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copied === platform ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-800/50 rounded-lg p-2.5">
                {caption}
              </p>
            </div>
          ))}

          {clip.hashtags && clip.hashtags.length > 0 && (
            <div>
              <span className="text-xs font-medium text-neutral-400 block mb-1">
                Hashtags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {clip.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
