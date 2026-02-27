"use client";

import { useRef, useEffect } from "react";
import { formatTimestamp, cn } from "@/lib/utils";
import type { TranscriptSegment } from "@/types";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  currentTime?: number;
  onSegmentClick?: (time: number) => void;
}

export default function TranscriptPanel({
  segments,
  currentTime = 0,
  onSegmentClick,
}: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime]);

  return (
    <div
      ref={containerRef}
      className="h-[400px] overflow-y-auto space-y-0.5 pr-2"
    >
      {segments.map((segment, i) => {
        const isActive =
          currentTime >= segment.start && currentTime < segment.end;

        return (
          <button
            key={i}
            ref={isActive ? activeRef : null}
            onClick={() => onSegmentClick?.(segment.start)}
            className={cn(
              "flex gap-3 w-full text-left px-3 py-1.5 rounded-lg transition-colors",
              isActive
                ? "bg-violet-600/15 text-white"
                : "hover:bg-neutral-800/50 text-neutral-400"
            )}
          >
            <span className="text-xs text-neutral-500 font-mono flex-shrink-0 pt-0.5 w-12">
              {formatTimestamp(segment.start)}
            </span>
            <span className="text-sm leading-relaxed">{segment.text}</span>
          </button>
        );
      })}
    </div>
  );
}
