import Link from "next/link";
import { formatDuration, cn } from "@/lib/utils";
import type { Source } from "@/types";
import { Clock, ExternalLink, Youtube, Mic, Upload, Tv } from "lucide-react";

const sourceTypeIcons: Record<string, React.ElementType> = {
  youtube: Youtube,
  podcast: Mic,
  upload: Upload,
  twitch: Tv,
};

const statusColors: Record<string, string> = {
  pending: "bg-neutral-500/20 text-neutral-400",
  transcribing: "bg-amber-500/20 text-amber-400",
  analyzing: "bg-violet-500/20 text-violet-400",
  ready: "bg-emerald-500/20 text-emerald-400",
  error: "bg-red-500/20 text-red-400",
};

export default function SourceCard({ source }: { source: Source }) {
  const Icon = sourceTypeIcons[source.source_type] || Upload;

  return (
    <Link
      href={`/dashboard/source/${source.id}`}
      className="group rounded-xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors overflow-hidden"
    >
      {/* Thumbnail / Placeholder */}
      <div className="aspect-video bg-neutral-800 flex items-center justify-center relative">
        {source.thumbnail_url ? (
          <img
            src={source.thumbnail_url}
            alt={source.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-8 h-8 text-neutral-600" />
        )}
        <div
          className={cn(
            "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium",
            statusColors[source.status] || statusColors.pending
          )}
        >
          {source.status}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate group-hover:text-white transition-colors">
          {source.title || "Untitled"}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Icon className="w-3 h-3" />
            {source.source_type}
          </div>
          {source.duration_seconds && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(source.duration_seconds)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
